import React, { useEffect, useState } from "react";
import { ref, child, get, set } from "firebase/database";
import configFirebaseDB from "../Configuration/config";
import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import { useNavigate } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import Toast from "../Components/Notifications/Toast";

const StoreList = ({ productCode, category }) => {
  const [storesWithProduct, setStoresWithProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [noStoresFound, setNoStoresFound] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [selectedStoreadd, setSelectedStoreadd] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [storeAddress, setstoreAddress] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [selectedVariety, setSelectedVariety] = useState(null);
  const navigate = useNavigate();

  const uid = sessionStorage.getItem("uid");

  useEffect(() => {
    const database = configFirebaseDB();
    const usersAccountRef = ref(database, "store_information");
    const storeaddRef = ref(database, "store_address_information");
    const productInventoryRef = ref(database, "product_inventory");

    // Fetch store address information
    get(storeaddRef)
      .then((snapshot) => {
        if (!snapshot.exists()) {
          console.error("Store address information not found.");
          return;
        }
        const storeAddressData = snapshot.val();
        // Set the store address state variable
        setstoreAddress(storeAddressData);
      })
      .catch((error) => {
        console.error("Error fetching store address:", error);
      });

    // Fetch product details
    get(productInventoryRef)
      .then((snapshot) => {
        if (!snapshot.exists()) {
          console.error("Product details not found.");
          setIsLoading(false);
          return;
        }
        const productDetails = snapshot.val();
        // Filter products based on the desired product code
        const filteredProducts = Object.values(productDetails).filter(
          (product) => String(product.product_code) === String(productCode)
        );
        setFilteredProducts(filteredProducts);
        if (filteredProducts.length === 0) {
          console.error(`No product found with code ${productCode}`);
          setIsLoading(false);
          setNoStoresFound(true);
          return;
        }
        // Extract store IDs from the filtered products
        const storeIds = filteredProducts.map(
          (product) => product.id.split("-")[0] + "-" + product.id.split("-")[1]
        );
        // Fetch store details for the identified stores
        const storePromises = storeIds.map((storeKey) =>
          get(child(usersAccountRef, storeKey))
        );
        return Promise.all(storePromises);
      })
      .then((storeSnapshots) => {
        const stores = [];
        storeSnapshots.forEach((snapshot) => {
          if (snapshot.exists()) {
            stores.push(snapshot.val());
          } else {
            console.error("Store details not found for a specific store.");
          }
        });
        if (stores.length === 0) {
          console.error("No store details found.");
          setNoStoresFound(true);
          return;
        }
        setStoresWithProduct(stores);
      })
      .catch((error) => {
        console.error("Error fetching store details:", error);
        setNoStoresFound(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [productCode]);

  // Function to open the modal
  const openModal = (store, add) => {
    setSelectedStore(store);
    setSelectedStoreadd(add);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStore(null);
    setSelectedQuantity(1);
  };

  // Function to add to cart
  const addToCart = () => {
    if (!selectedStore || filteredProducts.length === 0) {
      console.error(
        "Cannot add to cart: Selected store or product not available."
      );
      return;
    }
    const product = filteredProducts[0];
    const cartItem = {
      commodity_type: product.commodity_type,
      keywords: product.keywords,
      price: product.price,
      product_code: product.product_code,
      product_name: product.product_name,
      unit_measurement: product.unit_measurement,
      qty: selectedQuantity,
    };
    const cartKey = `${uid}_${selectedStore.id}`;
    const cartCollectionPath = `cart_collection/${cartKey}`;
    const cartCollectionRef = ref(configFirebaseDB(), cartCollectionPath);
    console.log(selectedStore);
    get(cartCollectionRef)
      .then((snapshot) => {
        const cartData = snapshot.exists() ? snapshot.val() : {};
        cartData.storeName = selectedStore.name;
        cartData.store_id = selectedStore.id;
        cartData.consumer_id = uid;
        cartData.CartList = cartData.CartList || {};
        cartData.CartList[product.product_code] = cartItem;
        return set(cartCollectionRef, cartData);
      })
      .then(() => {
        console.log("Item added to cart successfully.");
        setToastMessage("Item added to cart successfully.");
        setShowToast(true);
      })
      .catch((error) => {
        console.error("Error adding item to cart:", error);
      })
      .finally(() => {
        closeModal();
      });
  };

  // Function to open the checkout modal
  const openCheckoutModal = (store, add) => {
    setSelectedStore(store);
    setSelectedStoreadd(add);
    setIsCheckoutModalOpen(true);
  };

  // Function to close the checkout modal
  const closeCheckoutModal = () => {
    setIsCheckoutModalOpen(false);
    setSelectedStore(null);
  };

  // Function to increment quantity
  const incrementQuantity = () => {
    setSelectedQuantity((prevQuantity) => Math.min(prevQuantity + 1, 5));
  };

  // Function to decrement quantity, with a minimum value of 1
  const decrementQuantity = () => {
    setSelectedQuantity((prevQuantity) => Math.max(prevQuantity - 1, 1));
  };

  // Function to handle variety selection
  const handleVarietyChange = (event) => {
    setSelectedVariety(event.target.value);
  };

  // Function to handle checkout
  const handleCheckout = (product) => {
    if (!product || !selectedStore) {
      console.error(
        "Cannot proceed to checkout: Product or store not available."
      );
      return;
    }
    const selectedItems = [
      {
        productId: product.id.split("-")[2],
        productInfo: { ...product, qty: selectedQuantity },
        storeKey: `${uid}_${selectedStore.id}`,
      },
    ];

    const storeNames = {
      [`${uid}_${selectedStore.id}`]: selectedStore.name,
    };

    console.log(storeNames);

    const path = `/main/productinfo/${product.id.split("-")[2]}/${category}`;
    navigate("/route/checkout", { state: { selectedItems, storeNames, path } });
  };

  return (
    <div>
      <div className="p-3 md:px-10">
        <h2 className=" font-bold text-green-700">Stores</h2>
        <span className="text-black/80 opacity-80 ">
          Choose the store you want to make a purchase from
        </span>
      </div>
      {!isLoading && !noStoresFound && (
        <ul className="space-y-4 mb-20 p-3 md:px-10">
          {storesWithProduct.map((store) => {
            const storeId = store.id;
            const addressData = storeAddress && storeAddress[storeId];
            return (
              <div
                key={store.id}
                className="bg-white rounded-md shadow-md grid grid-cols-10"
              >
                <div className=" col-span-7 p-4">
                  <div className="flex items-center space-x-2">
                    <p className="font-bold text-black/80 ">
                      {store.name.length > 12
                        ? `${store.name.slice(0, 12)}...`
                        : store.name}
                    </p>
                    <p className=" text-blue-500 font-semibold cursor-pointer">
                      Visit
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <LocationOnIcon
                      fontSize="10px"
                      className="text-green-600"
                    />
                    <p className="text-gray-700  font-semibold">
                      {addressData &&
                        `${addressData.city}, ${addressData.province}`}
                    </p>
                  </div>
                  <p className="text-gray-500  mt-4">1,032 sold</p>
                  <div className="flex space-x-2">
                    <div className="flex text-yellow-500">
                      <StarIcon fontSize="10px" />
                      <StarIcon fontSize="10px" />
                      <StarIcon fontSize="10px" />
                      <StarHalfIcon fontSize="10px" />
                      <StarBorderIcon fontSize="10px" />
                    </div>
                    <p className=" text-gray-500">3.5/5.0</p>
                  </div>
                </div>
                <div className=" items-center justify-center flex flex-col md:flex-row col-span-3 md:mx-4">
                  <button
                    onClick={() => openModal(store, addressData)}
                    className="bg-gray-300 h-1/2 text-gray-800  w-full font-bold whitespace-nowrap rounded-tr-md md:rounded-l-md"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => openCheckoutModal(store, addressData)}
                    className="bg-green-700 h-1/2 text-slate-50  font-bold w-full rounded-br-md md:rounded-r-md"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            );
          })}
          <h1 className="text-center text-black/80">-End of Page-</h1>
        </ul>
      )}
      {/* Modal for adding to cart */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="absolute bg-slate-50 p-4 rounded-md shadow-md w-4/5 space-y-4">
            <section>
              <h1 className="text-lg font-bold text-gray-800">
                {selectedStore.name}
              </h1>
              <p className="text-gray-700 ">
                {selectedStoreadd &&
                  `${selectedStoreadd.city}, ${selectedStoreadd.province}`}
              </p>
            </section>

            <section>
              {filteredProducts.length > 0 && (
                <div className="space-y-2 my-4 text-black/80">
                  <div className="flex items-center justify-between">
                    <p>Product:</p>
                    <p className="font-bold">
                      {filteredProducts[0].product_name}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p>Price:</p>
                    <p className="font-semibold text-green-700">
                      ₱ {filteredProducts[0].price} /{" "}
                      {filteredProducts[0].unit_measurement}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <label>Weight/Pieces: </label>
                    <select
                      name="variety"
                      value={selectedVariety}
                      onChange={handleVarietyChange}
                      className="py-1 px-5 border font-semibold rounded-md"
                    >
                      {filteredProducts.length > 0 &&
                        Object.values(filteredProducts[0].variety).map(
                          (variety) => (
                            <option key={variety.id} value={variety.id}>
                              {variety.name}
                            </option>
                          )
                        )}
                    </select>
                  </div>
                </div>
              )}
            </section>

            <section>
              <div className="flex items-center justify-between">
                <p className="text-black/80">Quantity:</p>
                <div className="flex items-center justify-end">
                  <button
                    onClick={decrementQuantity}
                    className="bg-red-500 text-white px-2 py-1 rounded-l-md"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={selectedQuantity}
                    onChange={(e) => setSelectedQuantity(e.target.value)}
                    className="border border-gray-300 px-2 py-1 text-center w-1/4"
                  />
                  <button
                    onClick={incrementQuantity}
                    className="bg-blue-500 text-white px-2 py-1 rounded-r-md"
                  >
                    +
                  </button>
                </div>
              </div>
            </section>

            <hr />
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={closeModal}
                className="text-black/80 px-4 py-2  rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={addToCart}
                className="bg-green-700 text-white px-4 py-2  rounded-md"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal for checkout */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="absolute bg-slate-50 p-4 rounded-md shadow-md w-4/5 space-y-4">
            <section>
              <h1 className="text-lg font-bold text-gray-800">
                {selectedStore.name}
              </h1>
              <p className="text-gray-700 ">
                {selectedStoreadd &&
                  `${selectedStoreadd.city}, ${selectedStoreadd.province}`}
              </p>
            </section>

            <section>
              {filteredProducts.length > 0 && (
                <div className="space-y-2 my-4 text-black/80">
                  <div className="flex items-center justify-between">
                    <p>Product:</p>
                    <p className="font-bold">
                      {filteredProducts[0].product_name}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p>Price:</p>
                    <p className="font-semibold text-green-700">
                      ₱ {filteredProducts[0].price} /{" "}
                      {filteredProducts[0].unit_measurement}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <label>Weight/Pieces: </label>
                    <select
                      name="variety"
                      value={selectedVariety}
                      onChange={handleVarietyChange}
                      className="py-1 px-5 border font-semibold rounded-md"
                    >
                      {filteredProducts.length > 0 &&
                        Object.values(filteredProducts[0].variety).map(
                          (variety) => (
                            <option key={variety.id} value={variety.id}>
                              {variety.name}
                            </option>
                          )
                        )}
                    </select>
                  </div>
                </div>
              )}
            </section>

            <section>
              <div className="flex items-center justify-between">
                <p className="text-black/80">Quantity:</p>
                <div className="flex items-center justify-end">
                  <button
                    onClick={decrementQuantity}
                    className="bg-red-500 text-white px-2 py-1 rounded-l-md"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={selectedQuantity}
                    onChange={(e) => setSelectedQuantity(e.target.value)}
                    className="border border-gray-300 px-2 py-1 text-center w-1/4"
                  />
                  <button
                    onClick={incrementQuantity}
                    className="bg-blue-500 text-white px-2 py-1 rounded-r-md"
                  >
                    +
                  </button>
                </div>
              </div>
            </section>

            <hr />
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={closeCheckoutModal}
                className=" text-black-80 px-4 py-2 rounded-md"
              >
                Cancel
              </button>
              <button
                className="bg-yellow-600 text-white px-4 py-2 rounded-md"
                onClick={() => handleCheckout(filteredProducts[0])}
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
      {showToast && (
        <Toast message={toastMessage} onClose={() => setShowToast(false)} />
      )}
    </div>
  );
};

export default StoreList;
