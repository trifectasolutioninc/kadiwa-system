import React, { useState, useEffect } from "react";
import { LocationOn, Search } from "@mui/icons-material";
import { imageConfig, commodityTypes } from "../Configuration/config-file";
import configFirebaseDB from "../Configuration/config";
import { ref, get } from "firebase/database";
import { Link, useLocation } from "react-router-dom";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Fab } from "@mui/material";

const HomeConsumer = () => {
  const [selectedCommodity, setSelectedCommodity] = useState("All Commodities");
  const [products, setProducts] = useState([]);
  const [userLocation, setUserLocation] = useState("Loading...");
  const [sortBy, setSortBy] = useState(""); // State for sorting
  const database = configFirebaseDB();
  const [isFabVisible, setIsFabVisible] = useState(false); 
  const [isAtTop, setIsAtTop] = useState(true); 
  const location = useLocation();
  const home_position = sessionStorage.getItem("home_position");

  const [scrollPositions, setScrollPositions] = useState({});

  useEffect(() => {
    // Fetch and display products initially
    displayProducts(selectedCommodity);
    // Fetch and display user location
    fetchUserLocation();
  
    // Delayed smooth scroll to the stored position
    const storedPosition = JSON.parse(home_position);
    const scrollPosition = storedPosition?.scrollPosition || scrollPositions[location.pathname]?.scrollPosition;
    
    const scrollToStoredPosition = () => {
      if (scrollPosition !== undefined) {
        window.scrollTo({
          top: scrollPosition,
        });
        // If the stored scroll position is not at the top, set isAtTop to false
        setIsAtTop(scrollPosition === 0);
      } else {
        window.scrollTo({
          top: 0,
        });
      }
    };
  
    const delay = 50; 
    const timeoutId = setTimeout(scrollToStoredPosition, delay);
  
    return () => clearTimeout(timeoutId); // Cleanup the timeout on component unmount
  }, [selectedCommodity, sortBy, location.pathname, scrollPositions]);
  

  useEffect(() => {
    const handleScroll = () => {
      // Show/hide Fab based on scroll position
      setIsFabVisible(window.scrollY > 100); // Adjust the threshold as needed
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);



  const handleBackToTopClick = () => {
    const scrollPosition = 0; // Scroll to the top
    
    window.scrollTo({
      top: scrollPosition,
      behavior: 'smooth',
    });

    // Save the new scroll position after a slight delay
    setTimeout(() => {
      sessionStorage.setItem("home_position", JSON.stringify({ scrollPosition }));
      setScrollPositions((prevScrollPositions) => ({
        ...prevScrollPositions,
        [location.pathname]: { scrollPosition },
      }));
      setIsAtTop(true); 
    }, 500); // Adjust the delay as needed
  };
  
  
  const handleProductLinkClick = (productCode) => {
    // Store scroll position and product code when clicking a product link
    const scrollPosition = window.scrollY;
    sessionStorage.setItem("home_position", JSON.stringify({ scrollPosition, productCode }));
    setScrollPositions((prevScrollPositions) => ({
        ...prevScrollPositions,
        [location.pathname]: { scrollPosition, productCode },
    }));
  };
  


  const handleCommodityClick = (commodityType) => {
    setSelectedCommodity(commodityType);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const displayProducts = (commodityType) => {
    const productsRef = ref(database, "products_info");
    get(productsRef)
      .then((snapshot) => {
        const productsData = snapshot.val() || {};
        let filteredProducts = Object.values(productsData).filter(
          (product) =>
            commodityType === "All Commodities" ||
            product.commodity_type === commodityType
        );

        // Sorting logic
        if (sortBy === "lowestToHighest") {
          filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
        } else if (sortBy === "highestToLowest") {
          filteredProducts = filteredProducts.sort((a, b) => b.price - a.price);
        }

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
    <main className="p-3 md:px-10 space-y-5 mb-20">
      <section id="topView" className="space-y-3">
        <h1 className="text-[2em] text-green-700 font-bold">
          Hello Kadiwa User! 
        </h1>
        <div id="userLocation" className="flex items-center">
          <LocationOn className="text-gray-700 mr-2" />
          <span id="userLocationText" className="text-gray-600">
            {userLocation}
          </span>
        </div>
      </section>

      <div className="">
        <img src={imageConfig.BannerV1} alt="" className="rounded-md" />
      </div>

      <section className=" flex items-center justify-around ">
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
          <select
            name=""
            id=""
            className="p-2 border border-gray-600 rounded-md text-black/80"
            onChange={handleSortChange}
          >
            <option value="">Sort by:</option>
            <option value="lowestToHighest">Lowest to Highest Price</option>
            <option value="highestToLowest">Highest to Lowest Price</option>
          </select>
        </div>
      </section>

      <section className="overflow-x-auto flex gap-3">
        {commodityTypes.map((commodityType, index) => (
          <button
            key={index}
            className={`w-full border-green-700 border ${
              selectedCommodity === commodityType
                ? "bg-green-700 text-white"
                : "text-green-700 bg-white"
            }  rounded py-2 px-4 w-auto whitespace-nowrap tab-button`}
            data-commodity-type={commodityType}
            onClick={() => handleCommodityClick(commodityType)}
          >
            {commodityType}
          </button>
        ))}
      </section>

      <section
        id="productlist"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        {products.map((product, index) => (
          <div
            key={index}
            className="container p-2 bg-white rounded-lg shadow-md"
          >
            <Link
              to={`/main/productinfo/${product.product_code}`}
              onClick={() => handleProductLinkClick(product.product_code)}
              className="flex flex-col space-y-5"
            >
              <div className="h-52 overflow-hidden">
                <img
                  id={`product${product.product_code}`}
                  alt={product.product_name}
                  className="w-full h-full object-cover"
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
      <h1 className="text-center text-black/80">-End of Page-</h1>
      {isFabVisible && !isAtTop && (
      <div className="fixed bottom-24 justify-end flex right-5  z-50 w-full">
      <div
  
        className="rounded-full bg-green-700 px-2 py-2 text-white items-center justify-center flex"
        onClick={handleBackToTopClick}
      >
        <KeyboardArrowUpIcon  fontSize="10px"/>
      </div>

      </div>
      )}
    
    </main>
  );
};

export default HomeConsumer;
