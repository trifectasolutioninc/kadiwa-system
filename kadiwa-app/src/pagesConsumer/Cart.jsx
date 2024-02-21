import React, { useState, useEffect } from "react";
import CartItem from "./CartItem"; // Import your CartItem component here
import { imageConfig, commodityTypes } from "../Configuration/config-file";
import configFirebaseDB from "../Configuration/config";
import { ref, get, remove, update } from "firebase/database";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import BackButton from "./BackToHome";

const Cart = () => {
  const uid = sessionStorage.getItem("uid");
  const [cartData, setCartData] = useState(null);
  const [isStoreChecked, setIsStoreChecked] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCartData = async () => {
      const database = configFirebaseDB();
      const cartRef = ref(database, "cart_collection");

      try {
        const cartSnapshot = await get(cartRef);
        if (cartSnapshot.exists()) {
          const filteredCartData = Object.entries(cartSnapshot.val())
            .filter(([key]) => key.includes(uid))
            .reduce((acc, [key, value]) => {
              acc[key] = value;
              return acc;
            }, {});

          setCartData(filteredCartData);
        } else {
          console.error("Cart data not found.");
          setCartData(null);
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };

    if (uid) {
      fetchCartData();
    }
  }, [uid]);

  // Handler for incrementing quantity
  const handleIncrementQuantity = (storeKey, productId) => {
    // Find the product in the cart data and update its quantity
    const updatedCartData = { ...cartData };
    updatedCartData[storeKey].CartList[productId].qty += 1;
    setCartData(updatedCartData);
  };

  // Handler for decrementing quantity
  const handleDecrementQuantity = (storeKey, productId) => {
    // Find the product in the cart data and update its quantity
    const updatedCartData = { ...cartData };
    const currentQty = updatedCartData[storeKey].CartList[productId].qty;
    if (currentQty > 1) {
      updatedCartData[storeKey].CartList[productId].qty -= 1;
      setCartData(updatedCartData);
    }
  };

  const getTotalQuantity = (cartData) => {
    let totalQuantity = 0;

    if (cartData) {
      for (const storeKey in cartData) {
        const store = cartData[storeKey];
        if (store.CartList) {
          for (const productKey in store.CartList) {
            const product = store.CartList[productKey];
            if (product) {
              totalQuantity += 1;
            }
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
              totalPrice +=
                cartData[storeKey]?.CartList[productId]?.price *
                  cartData[storeKey]?.CartList[productId]?.qty || 0;
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
          const remainingItems = Object.keys(
            cartData[storeKey]?.CartList || {}
          ).filter((productId) => !itemsToDelete.includes(productId));

          if (remainingItems.length === 0) {
            // If no items are left in the store, delete the entire store
            updates[`cart_collection/${storeKey}`] = null;
          } else {
            // If items are still present, only delete the selected items
            itemsToDelete.forEach((productId) => {
              updates[`cart_collection/${storeKey}/CartList/${productId}`] =
                null;
            });
          }
        }
      }
    }

    try {
      // Apply all updates to the database in a single transaction
      await update(ref(database), updates);

      // After successful deletion, trigger a re-fetch of cart data
      const cartSnapshot = await get(ref(database, "cart_collection"));
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
      console.error("Error deleting items:", error);
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
            productInfo: cartData?.[storeKey]?.CartList?.[productId],
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
    navigate("/route/checkout", {
      state: {
        selectedItems: selectedItemsArray,
        storeNames: storeNames,
        path: path,
      },
    });
  };

  return (
    <>
      <section className="fixed flex items-center justify-between gap-5 bg-neutral-100 w-full top-0 p-3 right-0 left-0 z-10 shadow-md">
        <div className="flex items-center gap-5 ">
          <BackButton />
          <h1 className="text-xl text-green-600  font-bold">
            Cart ({getTotalQuantity(cartData)})
          </h1>
        </div>
        <button
          className=" text-white bg-red-500 hover:bg-red-600 rounded-md px-3 py-1"
          onClick={handleDelete}
        >
          Delete
        </button>
      </section>
      <main className="p-3 md:p-10 space-y-5">
        {cartData !== null ? (
          <div>
            <div className="space-y-5 mt-14">
              <section className="space-y-5  max-h-screen overflow-y-auto">
                {Object.entries(cartData).map(([storeKey, storeInfo]) => (
                  <div
                    key={storeKey}
                    className="bg-gray-100 rounded-md shadow-md"
                  >
                    <div className="flex items-center justify-between bg-white top-0 left-0 right-0 p-2 border rounded-md">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-1"
                          checked={isStoreChecked[storeKey] || false}
                          onChange={() => handleStoreCheckboxChange(storeKey)}
                        />
                        <Link
                          to={`/main/storepage/${storeKey.split("_")[1]}`}
                          className="font-bold text-green-700"
                        >
                          {storeInfo.storeName}
                        </Link>
                      </div>
                      <Link
                        to={`/main/storepage/${storeKey.split("_")[1]}`}
                        className=" text-blue-400"
                      >
                        Visit Store
                      </Link>
                    </div>

                    <div className="p-1 space-y-3">
                      {Object.entries(storeInfo.CartList).map(
                        ([productId, productInfo]) => (
                          <CartItem
                            key={productId}
                            id={productId}
                            name={productInfo.product_name}
                            price={productInfo.price}
                            quantity={productInfo.qty}
                            imgAlt={
                              imageConfig[productInfo.keywords.toLowerCase()]
                            }
                            isChecked={
                              selectedItems[storeKey]?.[productId] || false
                            }
                            onCheckboxChange={() =>
                              handleItemCheckboxChange(storeKey, productId)
                            }
                            onIncrement={() =>
                              handleIncrementQuantity(storeKey, productId)
                            }
                            onDecrement={() =>
                              handleDecrementQuantity(storeKey, productId)
                            }
                          />
                        )
                      )}
                    </div>
                    {/* Cart Items */}
                  </div>
                ))}
              </section>
            </div>
            <h1 className="text-center mt-10 mb-36 text-black/80">
              -End of Page-
            </h1>
          </div>
        ) : (
          <div>
            <div>
              <section className="flex items-center justify-between">
                <div className="flex items-center gap-5 ">
                  <BackButton />
                  <h1 className="text-xl text-green-600  font-bold">
                    Cart (0)
                  </h1>
                </div>
                <button className=" text-white bg-red-500 hover:bg-red-600 rounded-md px-3 py-1">
                  Delete
                </button>
              </section>
              <div>
                <div className="m-4 bg-green-600 p-2 rounded-md ">
                  <div className="m-4 bg-green-600 p-2 rounded-md flex justify-between">
                    <p className="font-bold text-white">Total: 0</p>
                    <button className="bg-white px-4 rounded-md text-green-700">
                      <p>CHECKOUT</p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="fixed bg-white bottom-20 right-2 left-2">
          <div className=" bg-green-600 p-2 rounded-md flex justify-between">
            <p className="font-bold text-white">
              Total: {getTotalPrice(cartData, selectedItems)}
            </p>
            <button
              className="bg-white px-4 rounded-md text-green-700"
              onClick={handleCheckout}
            >
              <p>CHECKOUT</p>
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default Cart;
