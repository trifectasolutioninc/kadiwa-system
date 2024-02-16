import React, { useState, useEffect } from 'react';
import CartItem from './CartItem'; // Import your CartItem component here
import { imageConfig, commodityTypes } from '../Configuration/config-file';
import configFirebaseDB from '../Configuration/config';
import { ref, get, remove, update } from 'firebase/database';
import { Link, useNavigate, NavLink  } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";

const Cart = () => {
  const uid = sessionStorage.getItem('uid');
  const [cartData, setCartData] = useState(null);
  const [isStoreChecked, setIsStoreChecked] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCartData = async () => {
      const database = configFirebaseDB();
      const cartRef = ref(database, 'cart_collection');

      try {
        const cartSnapshot = await get(cartRef);
        if (cartSnapshot.exists()) {
          // Filter cart data based on the presence of uid
          const filteredCartData = Object.entries(cartSnapshot.val())
            .filter(([key]) => key.includes(uid))
            .reduce((acc, [key, value]) => {
              acc[key] = value;
              return acc;
            }, {});

          setCartData(filteredCartData);
        } else {
          console.error('Cart data not found.');
          setCartData(null);
        }
      } catch (error) {
        console.error('Error fetching cart data:', error);
      }
    };

    if (uid) {
      fetchCartData();
    }
  }, [uid]);


  const getTotalQuantity = (cartData) => {
    let totalQuantity = 0;

    if (cartData) {
      for (const storeKey in cartData) {
        const store = cartData[storeKey];
        if (store.CartList) {
          for (const productKey in store.CartList) {
            const product = store.CartList[productKey];
            totalQuantity++;
          }
        }
      }
    }

    return totalQuantity;
  };

  const getTotalPrice = (cartData, selectedItems) => {
    let totalPrice = 0;

    if (cartData && selectedItems) {
      for (const storeKey in selectedItems) {
        const store = selectedItems[storeKey];
        if (store) {
          for (const productId in store) {
            if (store[productId]) {
              totalPrice += cartData[storeKey]?.CartList[productId]?.price || 0;
            }
          }
        }
      }
    }

    return totalPrice.toFixed(2);
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
        // Filter cart data based on the presence of uid
        const filteredCartData = Object.entries(cartSnapshot.val())
          .filter(([key]) => key.includes(uid))
          .reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
          }, {});

        setCartData(filteredCartData);
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

  const handleCheckout = () => {
    const selectedItemsArray = [];
  
    for (const storeKey in selectedItems) {
      for (const productId in selectedItems[storeKey]) {
        if (selectedItems[storeKey][productId]) {
          selectedItemsArray.push({
            storeKey,
            productId,
            productInfo: cartData?.[storeKey]?.CartList?.[productId]
          });
        }
      }
    }
  
    console.log("Selected Items Array:", selectedItemsArray); // Check if data is being prepared correctly
  
    // Extract store names
    const storeNames = {};
    for (const item of selectedItemsArray) {
      const storeKey = item.storeKey;
      const storeInfo = cartData?.[storeKey];
      if (storeInfo) {
        storeNames[storeKey] = storeInfo.storeName;
      }
    }
    const path = `/main/cart`;
    navigate('/route/checkout', { state: { selectedItems: selectedItemsArray, storeNames: storeNames, path } });
  };
  



  return (
    <div className="h-screen bg-gray-100">
      {cartData !== null ? (
        <div>
          <div>
          <div className='flex pt-4 mb-1 justify-between'>
            <div className='flex items-center'>
            <NavLink to={"/main"} className='px-4'>
              <IoMdArrowRoundBack />
            </NavLink>
            <h1 className="text-lg text-green-600  font-bold">Cart ({getTotalQuantity(cartData)})</h1>

            </div>
            <div>
                <span className="text-xs text-red-500 mr-2 bg-white rounded-full px-2 p-1 cursor-pointer" onClick={handleDelete}>
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
                      <Link to={`/main/storepage/${storeKey.split('_')[1]}`} className="text-sm font-bold text-green-700">{storeInfo.storeName}</Link>
                    </div>
                    <Link to={`/main/storepage/${storeKey.split('_')[1]}`} className="text-xs text-blue-400">Visit Store</Link>
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
          <div>
            <div className='m-4 bg-green-600 p-2 rounded-md flex justify-between'>
              <p className='font-bold text-white'>Total:  {getTotalPrice(cartData, selectedItems)}</p>
              <button className='bg-white px-4 rounded-md text-green-700' onClick={handleCheckout}>
                <p >CHECKOUT</p>

              </button>

            </div>

          </div>

        </div>
      ) : (
        <div>
          <div>
            <div className="p-4 flex justify-between">
              <h1 className="font-bold text-lg p-4 text-green-600">Cart (0)</h1>
              <div>
                <span className="text-xs text-red-500 mr-2 bg-white rounded-full px-2 p-1 cursor-pointer">
                  Delete
                </span>
              </div>
            </div>
            <div>
              <div className='m-4 bg-green-600 p-2 rounded-md '>
         
                <div className='m-4 bg-green-600 p-2 rounded-md flex justify-between'>
                  <p className='font-bold text-white'>Total: 0</p>
                  <div className='bg-white px-4 rounded-md text-green-700'>
                    <p >CHECKOUT</p>

                  </div>

                </div>

              </div>

            </div>


          </div>




        </div>
 

  )
}


    </div >
  );
};


export default Cart;
