import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ref, get } from "firebase/database";
import configFirebaseDB from "../Configuration/config";
import ChatIcon from "@mui/icons-material/Chat";
import { imageConfig, commodityTypes } from "../Configuration/config-file";
import { Link, NavLink } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import StoreMap from "./StoreMap";

const StorePage = () => {
  const { storeID } = useParams();
  const [storeData, setStoreData] = useState(null);
  const [storeAddress, setstoreAddress] = useState(null);
  const [selectedCommodity, setSelectedCommodity] = useState("All Commodities");
  const [products, setProducts] = useState([]);
  const kdwconnect = sessionStorage.getItem("kdwconnect");

  useEffect(() => {
    const fetchStoreData = async () => {
      const database = configFirebaseDB();
      const storeRef = ref(database, `store_information/${storeID}`);
      const storeaddRef = ref(database, `store_address_information/${storeID}`);

      try {
        const storeSnapshot = await get(storeRef);
        const storeaddSnapshot = await get(storeaddRef);

        if (storeSnapshot.exists() && storeaddSnapshot.exists()) {
          const storeInfo = storeSnapshot.val();
          const storeaddInfo = storeaddSnapshot.val();
          setStoreData(storeInfo);
          setstoreAddress(storeaddInfo);
          setSelectedCommodity("All Commodities"); // Set a default value or adjust as needed
        } else {
          console.error(`Store with ID ${storeID} not found`);
        }
      } catch (error) {
        console.error("Error fetching store data:", error);
      }
    };

    fetchStoreData();
  }, [storeID]);

  const handleCommodityClick = (commodityType) => {
    setSelectedCommodity(commodityType);
  };

  useEffect(() => {
    // Fetch and display products based on commodity type and store contact
    displayProducts(selectedCommodity);
  }, [selectedCommodity, storeData]);

  const displayProducts = (commodityType) => {
    if (!storeData) {
      return <div>Loading...</div>;
    }

    if (!storeData.id) {
      console.error(
        "Cannot fetch and filter products: storeData.contact is null"
      );
      return;
    }

    const productsRef = ref(configFirebaseDB(), "product_inventory");

    get(productsRef)
      .then((snapshot) => {
        const productsData = snapshot.val() || {};

        // Assuming you have a specific node structure in your database
        const filteredProducts = Object.values(productsData).filter(
          (product) => {
            // Check if the product ID contains storeContact
            return (
              product.id.includes(storeData.id) &&
              (commodityType === "All Commodities" ||
                product.commodity_type === commodityType)
            );
          }
        );

        setProducts(filteredProducts);
      })
      .catch((error) => {
        console.error("Error fetching and filtering products:", error);
      });
  };

  if (!storeData) {
    return <div>Loading...</div>;
  }

  return (
    <main className="p-3 md:p-10 bg-gray-100 space-y-5">
      <NavLink to={"/main/store"} className="">
        <IoMdArrowRoundBack fontSize={"25px"} />
      </NavLink>

      <section className="p-4 space-y-2 rounded-md bg-white shadow-md">
        <div className=" justify-between flex">
          <h1 className="text-gray-700 font-bold text-lg">{storeData.name}</h1>
          <Link to={`/route/chatpage/${storeID}`} className="text-green-600">
            <button>
              <ChatIcon className="text-green-600 " />
            </button>
          </Link>
        </div>
        <hr />
        <div className="space-y-1">
          <p className="text-gray-500 text-sm">
            {storeAddress.city + ", " + storeAddress.province}
          </p>
          <p className="text-gray-500 text-sm">Store Type: {storeData.type}</p>
          <p className="text-gray-500 text-sm">Partner</p>
        </div>
      </section>

      <StoreMap />

      <div className="flex justify-between">
        <div className="font-semibold text-gray-600">
          <h1>Products</h1>
        </div>
        <div className=" space-x-2 "></div>
      </div>

      <section className="overflow-x-auto flex gap-3">
        {commodityTypes.map((commodityType, index) => (
          <button
            key={index}
            className={`border-green-700 border ${
              selectedCommodity === commodityType
                ? "bg-green-700 text-white"
                : "text-green-700 bg-white"
            } w-full rounded py-2 px-4 whitespace-nowrap tab-button`}
            data-commodity-type={commodityType}
            onClick={() => handleCommodityClick(commodityType)}
          >
            {commodityType}
          </button>
        ))}
      </section>

      {/* Display filtered products */}
      <section
        id="Store List"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        {products.map((product, index) => (
          <div
            key={index}
            className="container p-2 bg-white rounded-lg shadow-md"
          >
            <Link
              to={`/route/product/${product.id}`}
              className="flex flex-col space-y-5"
            >
              <div className="h-52 overflow-hidden">
                <img
                  id={`product${product.product_code}`}
                  alt={product.product_name}
                  className="h-full w-full object-cover"
                  src={imageConfig[product.keywords.toLowerCase()]}
                />
              </div>
              <div className="flex flex-col space-y-2">
                <h2 className="text-black/80 text-lg font-bold truncate">
                  {product.product_name}
                </h2>
                <p className="font-semibold text-gray-500 truncate">
                  {product.commodity_type}
                </p>
                <p className="font-bold text-green-600">
                  Php {product.price.toFixed(2)}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </section>
      <div className="p-16"></div>
    </main>
  );
};

export default StorePage;
