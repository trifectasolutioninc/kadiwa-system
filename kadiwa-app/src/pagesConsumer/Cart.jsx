import React, { useState, useEffect } from 'react';
import CartItem from './CartItem'; // Import your CartItem component here
import { imageConfig , commodityTypes } from '../Configuration/config-file';
import configFirebaseDB from '../Configuration/config';
import { ref, get } from 'firebase/database';

const Cart = () => {
  const kdwconnect = sessionStorage.getItem('kdwconnect');
  const [cartData, setCartData] = useState(null);

  useEffect(() => {
    const fetchCartData = async () => {
      const database = configFirebaseDB();
      const cartRef = ref(database, 'cart_collection');

      try {
        const cartSnapshot = await get(cartRef);
        if (cartSnapshot.exists()) {
          setCartData(cartSnapshot.val());
        } else {
          console.error('Cart data not found.');
        }
      } catch (error) {
        console.error('Error fetching cart data:', error);
      }
    };

    if (kdwconnect) {
      fetchCartData();
    }
  }, [kdwconnect]);

  return (
    <div>
      {cartData && (
        <div>
          <div className="p-4 flex justify-between">
            <h1 className="font-bold text-lg">Cart ({Object.keys(cartData).length})</h1>
            <div>
              <span className="text-xs text-gray-500 mr-2">Edit</span>
              <span className="text-xs text-gray-500">Delete</span>
            </div>
          </div>

          <div className="mb-16">
            {Object.entries(cartData).map(([storeId, storeInfo]) => (
              <div key={storeId} className="bg-white rounded shadow-md m-4 p-2">
                <div className="flex justify-between">
                  <div className="flex">
                    <input type="checkbox" className="mr-1" />
                    <p className="text-sm">{storeInfo.storeName}</p>
                  </div>
                  <span className="text-xs text-gray-400">Visit Store</span>
                </div>

                {/* Cart Items */}
                {Object.entries(storeInfo.CartList).map(([productId, productInfo]) => (
                  <CartItem
                    key={productId}
                    id={productId}
                    name={productInfo.product_name}
                    price={productInfo.price}
                    quantity={productInfo.qty}
                    imgAlt={imageConfig[productInfo.keywords.toLowerCase()]}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
