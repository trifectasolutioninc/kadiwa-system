import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ref, get, update } from "firebase/database";
import firebaseDB from "../Configuration/config";
import ChatIcon from "@mui/icons-material/Chat";
import { imageConfig, commodityTypes } from "../Configuration/config-file";
import { Link, useNavigate } from "react-router-dom";

const StoreInfo = () => {
  const { productCode } = useParams();
  const [storeData, setStoreData] = useState(null);
  const [storeAddress, setstoreAddress] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const uid = sessionStorage.getItem("uid");
  const sid = productCode.split("-")[0] + "-" + productCode.split("-")[1];
  const productno = productCode.split("-")[2];
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStoreData = async () => {
      const database = firebaseDB();
      const storeRef = ref(database, `store_information/${sid}`);
      const storeaddRef = ref(database, `store_address_information/${sid}`);

      try {
        const storeSnapshot = await get(storeRef);
        const storeaddSnapshot = await get(storeaddRef);

        if (storeSnapshot.exists() && storeaddSnapshot.exists()) {
          const storeInfo = storeSnapshot.val();
          const storeaddInfo = storeaddSnapshot.val();
          setStoreData(storeInfo);
          console.log(storeInfo);
          console.log(storeaddInfo);
          setstoreAddress(storeaddInfo);
        } else {
          console.error(`Store with ID ${sid} not found`);
        }
      } catch (error) {
        console.error("Error fetching store data:", error);
      }
    };

    fetchStoreData();
  }, [productCode, sid]);

  const fetchProductDetails = async () => {
    const database = firebaseDB();
    const productRef = ref(database, `product_inventory/${sid}-${productno}`);

    try {
      const productSnapshot = await get(productRef);

      if (productSnapshot.exists()) {
        const productDetails = productSnapshot.val();
        setSelectedProduct(productDetails);
      } else {
        console.error(`Product with ID ${sid}-${productno} not found`);
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  fetchProductDetails();

  const openModal = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const addToCart = () => {
    if (!selectedProduct) {
      console.error("Cannot add to cart: No product selected.");
      return;
    }

    const cartItem = {
      commodity_type: selectedProduct.commodity_type,
      keywords: selectedProduct.keywords,
      price: selectedProduct.price,
      product_code: selectedProduct.product_code,
      product_name: selectedProduct.product_name,
      unit_measurement: selectedProduct.unit_measurement,
      qty: qty,
    };

    const cartKey = `${uid}-${sid}`;
    const cartCollectionPath = `cart_collection/${cartKey}`;
    const cartCollectionRef = ref(firebaseDB(), cartCollectionPath);

    get(cartCollectionRef)
      .then((snapshot) => {
        const cartData = snapshot.exists() ? snapshot.val() : {};
        cartData.storeName = storeData.name;
        cartData.ownerNo = storeData.contact_no;
        cartData.CartList = cartData.CartList || {};
        cartData.CartList[selectedProduct.product_code] = cartItem;
        return update(cartCollectionRef, cartData);
      })
      .then(() => {
        console.log("Item added to cart successfully.");
        // Optionally, you can set a toast message here
      })
      .catch((error) => {
        console.error("Error adding item to cart:", error);
      })
      .finally(() => {
        setModalOpen(false);
      });
  };

  if (!storeData) {
    return <div>Loading...</div>;
  }

  const incrementQty = () => {
    setQty((prevQty) => Math.min(prevQty + 1, 5));
  };

  const decrementQty = () => {
    setQty((prevQty) => Math.max(1, prevQty - 1));
  };

  const openCheckoutModal = (selectedProduct) => {
    setIsCheckoutModalOpen(true);
  };

  // Function to close the checkout modal
  const closeCheckoutModal = () => {
    setIsCheckoutModalOpen(false);
  };

  const handleCheckout = (product) => {
    if (!product || !storeData || !qty) {
      console.error(
        "Cannot proceed to checkout: Product or store not available."
      );
      return;
    }

    console.log("TEST", product);
    console.log("STR", storeData);
    console.log("QTY", qty);

    const selectedItems = [
      {
        productId: product.product_code,
        productInfo: { ...product, qty: qty }, // Assuming you're using qty state for selected quantity
        storeKey: `${uid}_${sid}`,
      },
    ];

    const storeNames = {
      [sid]: storeData.name,
    };

    console.log("NAME", storeNames);

    const path = `/route/product/${sid}-${product.product_code}`;
    // Assuming you have a function to navigate to the checkout page, replace 'navigate' with the appropriate function
    navigate("/route/checkout", {
      state: { selectedItems, storeNames: storeNames, path: path },
    });
  };

  return (
    <>
      <div className="p-3 md:px-5">
        <div className=" justify-between flex items-center p-4 rounded-md">
          <div>
            <h1 className="text-gray-700 font-bold text-lg">
              {storeData.name}
            </h1>
            <p className="text-gray-500 text-sm">
              {storeAddress.city + ", " + storeAddress.province}
            </p>
          </div>
          <Link to={`/main/storepage/${sid}`} className="">
            <button className="bg-green-700 text-white rounded-md px-4 py-2">
              Visit
            </button>
          </Link>
        </div>
        {/* Modal */}
        {modalOpen && selectedProduct && storeData && storeAddress && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
            <div className="absolute bg-white p-6 rounded-md shadow-md w-3/4">
              <h3 className="text-lg font-bold text-gray-800">
                {storeData.name}
              </h3>
              <p className="text-gray-700  ">
                {storeAddress.city}, {storeAddress.province}
              </p>
              <p className="mt-4">{selectedProduct.product_name}</p>
              <p className="">Price: ₱{selectedProduct.price}</p>
              <select name="" id="">
                <option value="">Select Variety</option>
                <option value="">1 unit</option>
                <option value="">2 unit</option>
                <option value="">3 unit</option>
              </select>
              <div className="flex items-center mt-2">
                <button
                  onClick={decrementQty}
                  className="bg-gray-700 text-white px-2 py-1 rounded-l-md"
                >
                  -
                </button>
                <input
                  type="number"
                  onChange={(e) =>
                    setQty(Math.max(1, parseInt(e.target.value) || 0))
                  }
                  value={qty}
                  className="border border-gray-300 px-2 py-1  text-center w-full"
                />
                <button
                  onClick={incrementQty}
                  className="bg-gray-700 text-white px-2 py-1 rounded-r-md"
                >
                  +
                </button>
              </div>
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2  rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={() => addToCart()}
                  className="bg-green-700 text-white px-4 py-2  rounded-md"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        )}
        {isCheckoutModalOpen &&
          selectedProduct &&
          storeData &&
          storeAddress && (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-sm">
              <div className="absolute bg-white p-6 rounded-md shadow-md w-3/4">
                <h3 className="text-lg font-bold text-gray-800">
                  {storeData.name}
                </h3>
                <p className="text-gray-700 ">
                  {storeAddress &&
                    `${storeAddress.city}, ${storeAddress.province}`}
                </p>

                <div className="space-y-1 my-4 text-black/80">
                  <p className="">
                    Product:{" "}
                    <span className="font-medium">
                      {selectedProduct.product_name}
                    </span>
                  </p>
                  <p>
                    Price:
                    <span className="font-medium">
                      {" "}
                      ₱ {selectedProduct.price}
                    </span>
                    / unit
                  </p>
                  <div>
                    <label>Variety: </label>
                    <select
                      name=""
                      id=""
                      className="p-1 border font-medium rounded-md"
                    >
                      <option value="">Select Variety</option>
                      <option value="">1 unit</option>
                      <option value="">3 unit</option>
                      <option value="">5 unit</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center mt-2">
                  <button
                    onClick={decrementQty}
                    className="bg-red-500 text-white px-2 py-1 rounded-l-md"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    onChange={(e) =>
                      setQty(Math.max(1, parseInt(e.target.value) || 0))
                    }
                    value={qty}
                    className="border border-gray-300 px-2 py-1  text-center w-full"
                  />
                  <button
                    onClick={incrementQty}
                    className="bg-blue-500 text-white px-2 py-1 rounded-r-md"
                  >
                    +
                  </button>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <button
                    onClick={closeCheckoutModal}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-yellow-600 text-white px-4 py-2 rounded-md"
                    onClick={() => handleCheckout(selectedProduct)}
                  >
                    Checkout
                  </button>
                </div>
              </div>
            </div>
          )}
      </div>
      <div className="flex justify-around fixed bottom-0 w-full">
        <button
          onClick={() => openModal(selectedProduct)}
          className="bg-gray-300  h-16  text-gray-800 w-full font-bold whitespace-nowrap rounded-tr-md md:rounded-none "
        >
          Add to Cart
        </button>
        <button
          onClick={() => openCheckoutModal(selectedProduct)}
          className="bg-green-700  text-white font-bold w-full rounded-br-md md:rounded-none"
        >
          Buy Now
        </button>
      </div>
    </>
  );
};

export default StoreInfo;
