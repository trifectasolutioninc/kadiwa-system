import React, { useState, useEffect } from 'react';
import CartItem from './CartItem'; // Import your CartItem component here
import { imageConfig , commodityTypes } from '../Configuration/config-file';
import configFirebaseDB from '../Configuration/config';
import { ref, get, remove, update  } from 'firebase/database';

const Cart = () => {
  const kdwconnect = sessionStorage.getItem('kdwconnect');
  const [cartData, setCartData] = useState(null);
  const [isStoreChecked, setIsStoreChecked] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);


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
          setCartData(null);
        }
      } catch (error) {
        console.error('Error fetching cart data:', error);
      }
    };

    if (kdwconnect) {
      fetchCartData();
    }
  }, [kdwconnect]);

  const getTotalQuantity = (cartData) => {
    let totalQuantity = 0;
  
    if (cartData) {
      for (const storeKey in cartData) {
        const store = cartData[storeKey];
        if (store.CartList) {
          for (const productKey in store.CartList) {
            const product = store.CartList[productKey];
            totalQuantity += product.qty || 0;
          }
        }
      }
    }
  
    return totalQuantity;
  };
  
  const handleStoreCheckboxChange = (storeKey) => {
    setIsStoreChecked((prev) => {
      const newState = !prev[storeKey];
      const updatedIsStoreChecked = { ...prev, [storeKey]: newState };
  
      setSelectedItems((prevSelectedItems) => {
        const itemsToToggle = Object.keys(cartData[storeKey]?.CartList || {});
        const updatedItems = itemsToToggle.reduce((acc, productId) => {
          acc[productId] = newState;
          return acc;
        }, {});
  
        return {
          ...prevSelectedItems,
          [storeKey]: newState ? updatedItems : {},
        };
      });
  
      return updatedIsStoreChecked;
    });
  };
  

  const handleItemCheckboxChange = (storeKey, productId) => {
    setSelectedItems((prevSelectedItems) => {
      const isSelected = prevSelectedItems[storeKey]?.[productId];
      return {
        ...prevSelectedItems,
        [storeKey]: {
          ...(prevSelectedItems[storeKey] || {}),
          [productId]: !isSelected,
        },
      };
    });
  };

  const handleDelete = async () => {
    const database = configFirebaseDB();
    const updates = {};
  
    // Iterate through selected stores
    for (const storeKey of Object.keys(selectedItems)) {
      const storeChecked = isStoreChecked[storeKey];
  
      if (storeChecked) {
        // If store checkbox is checked, delete entire user cart in that store
        updates[`cart_collection/${storeKey}`] = null;
      } else {
        // If store checkbox is not checked, delete selected items
        const itemsToDelete = Object.keys(selectedItems[storeKey]).filter(
          (productId) => selectedItems[storeKey][productId]
        );
  
        if (itemsToDelete.length > 0) {
          // Check if the last item in the store is being deleted
          const remainingItems = Object.keys(cartData[storeKey]?.CartList || {}).filter(
            (productId) => !itemsToDelete.includes(productId)
          );
  
          if (remainingItems.length === 0) {
            // If no items are left in the store, delete the entire store
            updates[`cart_collection/${storeKey}`] = null;
          } else {
            // If items are still present, only delete the selected items
            itemsToDelete.forEach((productId) => {
              updates[`cart_collection/${storeKey}/CartList/${productId}`] = null;
            });
          }
        }
      }
    }
  
    try {
      // Apply all updates to the database in a single transaction
      await update(ref(database), updates);
  
      // After successful deletion, trigger a re-fetch of cart data
      const cartSnapshot = await get(ref(database, 'cart_collection'));
      if (cartSnapshot.exists()) {
        setCartData(cartSnapshot.val());
      } else {
        // If no cart data is found, set cartData to null
        setCartData(null);
      }
  
      // Reset the state
      setIsStoreChecked({});
      setSelectedItems({});
    } catch (error) {
      console.error('Error deleting items:', error);
    }
  };
  
  
  
  

  return (
    <div>
      {cartData !== null ? (
        <div>
          <div className="p-4 flex justify-between">
            <h1 className="font-bold text-lg p-4 text-green-600">Cart ({getTotalQuantity(cartData)})</h1>
            <div>
              <span className="text-xs text-gray-500 mr-2" onClick={handleDelete}>
                Delete
              </span>
            </div>
          </div>

          <div className="mb-16">
            {Object.entries(cartData).map(([storeKey, storeInfo]) => (
              <div key={storeKey} className="bg-white rounded shadow-md m-4 p-2">
                <div className="flex justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-1"
                      checked={isStoreChecked[storeKey] || false}
                      onChange={() => handleStoreCheckboxChange(storeKey)}
                    />
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
                    isChecked={selectedItems[storeKey]?.[productId] || false}
                    onCheckboxChange={() => handleItemCheckboxChange(storeKey, productId)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 flex justify-between">
            <h1 className="font-bold text-lg p-4 text-green-600">Cart (0)</h1>
            <div>
              <span className="text-xs text-gray-500 mr-2">
                Delete
              </span>
            </div>
        </div>
      )}
    </div>
  );
};


export default Cart;
