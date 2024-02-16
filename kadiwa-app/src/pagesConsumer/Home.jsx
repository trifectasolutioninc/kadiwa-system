// Import necessary modules
import React, { useState, useEffect } from "react";
import { LocationOn, Search, Notifications } from "@mui/icons-material";
import { imageConfig, commodityTypes } from "../Configuration/config-file";
import configFirebaseDB from "../Configuration/config";
import { ref, child, get } from "firebase/database";
import { Link } from "react-router-dom";

const HomeConsumer = () => {
  const [selectedCommodity, setSelectedCommodity] = useState("All Commodities");
  const [products, setProducts] = useState([]);
  const [userLocation, setUserLocation] = useState("Loading...");
  const database = configFirebaseDB();

  useEffect(() => {
    // Fetch and display products initially
    displayProducts(selectedCommodity);

    // Fetch and display user location
    fetchUserLocation();
  }, [selectedCommodity]);

  const handleCommodityClick = (commodityType) => {
    setSelectedCommodity(commodityType);
  };

  const displayProducts = (commodityType) => {
    const productsRef = ref(database, "products_info");
    // Use the 'value' event to fetch data once
    get(productsRef)
      .then((snapshot) => {
        const productsData = snapshot.val() || {};

        // Assuming you have a specific node structure in your database
        const filteredProducts = Object.values(productsData).filter(
          (product) =>
            commodityType === "All Commodities" ||
            product.commodity_type === commodityType
        );

        setProducts(filteredProducts);
      })
      .catch((error) => {
        console.error("Error fetching and filtering products:", error);
      });
  };

  const fetchUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLatitude = position.coords.latitude;
          const userLongitude = position.coords.longitude;

          fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${userLatitude}&lon=${userLongitude}&format=json`
          )
            .then((response) => response.json())
            .then((data) => {
              const address = data.display_name;
              const formattedAddress = `${address}`;
              setUserLocation(formattedAddress);
            })
            .catch((error) => {
              console.error("Error fetching location:", error);
              setUserLocation("Unable to retrieve location");
            });
        },
        (error) => {
          console.error("Error getting user location:", error);
          setUserLocation("Unable to retrieve location");
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setUserLocation("Geolocation not supported");
    }
  };

  return (
    <div className="p-5 bg-gray-100 space-y-5">
      <div id="topView" className="space-y-3">
        <h1 className="text-green-700 font-bold">Hello Kadiwa User!</h1>
        <div id="userLocation" className="flex items-center text-xs">
          <LocationOn className="text-gray-700 mr-2" />
          <span id="userLocationText" className="text-gray-600">
            {userLocation}
          </span>
        </div>
      </div>
      <div className="">
        <img src={imageConfig.BannerV1} alt="" className="rounded-md" />
      </div>

      <div className=" flex items-center justify-around ">
        <div className="flex-grow flex items-center">
          <div className="relative flex items-center bg-gray-300 rounded-md p-2 flex-grow">
            <Search className="text-gray-700 text-lg mr-2" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-gray-300 text-gray-600 focus:outline-none"
            />
          </div>
        </div>
        <div className="ml-4">
          <Notifications className="text-gray-700 text-lg" />
        </div>
      </div>

      <div className="overflow-x-auto flex gap-5">
        {commodityTypes.map((commodityType, index) => (
          <button
            key={index}
            className={`border-green-700 border ${
              selectedCommodity === commodityType
                ? "bg-green-700 text-white"
                : "text-green-700"
            } text-xs rounded py-2 px-4 w-auto whitespace-nowrap tab-button`}
            data-commodity-type={commodityType}
            onClick={() => handleCommodityClick(commodityType)}
          >
            {commodityType}
          </button>
        ))}
      </div>

      <div
        id="productlist"
        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        {products.map((product, index) => (
          <div
            key={index}
            className="container p-5  bg-white rounded-lg shadow-md"
          >
            <Link
              to={`/main/productinfo/${product.product_code}`}
              className="space-y-5"
            >
              <div className="text-left h-1/2">
                <img
                  id={`product${product.product_code}`}
                  alt={product.product_name}
                  className="h-full w-full object-cover"
                  src={imageConfig[product.keywords.toLowerCase()]}
                />
              </div>
              <div className="space-y-2">
                <h2 className="font-semibold truncate">
                  {product.product_name}
                </h2>
                <p className=" font-semibold text-gray-500 truncate">
                  {product.commodity_type}
                </p>
                <p className=" font-bold text-green-600">
                  Php {product.price.toFixed(2)}
                </p>
                {/* <Link className="text-xs font-semibold text-green-500 cursor-pointer border text-center border-green-600 p-2 rounded-md mt-1">
                  View
                </Link> */}
              </div>
            </Link>
          </div>
        ))}
      </div>
      <br />
      <br />
      <br />
    </div>
  );
};

export default HomeConsumer;
