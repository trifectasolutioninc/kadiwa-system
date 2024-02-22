import React, { useState, useEffect } from "react";
import { LocationOn, Search } from "@mui/icons-material";
import { imageConfig, commodityTypes } from "../Configuration/config-file";
import configFirebaseDB from "../Configuration/config";
import { ref, get } from "firebase/database";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Changed to useNavigate
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import GoodsCluster from "./Products/GoodsCluster";

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
  const navigate = useNavigate(); // Using useNavigate hook instead of useHistory
  const [searchQuery, setSearchQuery] = useState("");

  const [scrollPositions, setScrollPositions] = useState({});
  console.log(isFabVisible);
  console.log(isAtTop);

  useEffect(() => {
    // Fetch and display products initially
    displayProducts(selectedCommodity);
    // Fetch and display user location
    fetchUserLocation();
  }, [selectedCommodity, sortBy, location.pathname, scrollPositions]);

  useEffect(() => {
    const handleScroll = () => {
      // Show/hide Fab based on scroll position
      setIsFabVisible(window.scrollY > 100);
      // Adjust the threshold as needed
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleBackToTopClick = () => {
    const scrollPosition = 0; // Scroll to the top

    window.scrollTo({
      top: scrollPosition,
      behavior: "smooth",
    });

    // Save the new scroll position after a slight delay
    setTimeout(() => {
      sessionStorage.setItem(
        "home_position",
        JSON.stringify({ scrollPosition })
      );
      setScrollPositions((prevScrollPositions) => ({
        ...prevScrollPositions,
        [location.pathname]: { scrollPosition },
      }));

      setIsAtTop(true);
    }, 800); // Adjust the delay as needed

    setIsFabVisible(false);
  };

  const handleSearch = () => {
    if (searchQuery.length === 0) {
      navigate("/main/"); // Navigate to home page if search length is 0
    } else {
      if (searchQuery.trim().length > 0) {
        navigate(
          `/main/search?query=${encodeURIComponent(searchQuery.trim())}`
        );
      } // Navigate to search page if search length is more than 0
    }
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
              console.log(data);
              const address = `${data.address?.road + ", " || ""}${
                data.address?.neighbourhood + ", " || ""
              }${data.address?.quarter + ", " || ""}${
                data.address?.city_district + ", " || ""
              }${data.address?.city + " " || ""}`;

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
    <main className="p-3 md:px-10 space-y-5 mb-20 bg-neutral-100">
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
      {imageConfig.BannerV1 ? (
        <div className="w-full bg-cover flex items-center justify-center">
          <img
            src={imageConfig.BannerV1}
            alt=""
            className="object-cover rounded-md w-full h-full sm:w-auto sm:h-auto"
          />
        </div>
      ) : (
        <div className="w-full bg-cover flex items-center justify-center">
          <canvas className="object-cover rounded-md w-full h-full sm:w-auto sm:h-auto bg-green-700"></canvas>
        </div>
      )}

      <section className="sticky top-0 right-0 left-0 p-1 bg-neutral-100 flex items-center justify-around ">
        <div className="relative flex items-center bg-gray-300 rounded-md p-2 w-full">
          <Search onClick={handleSearch} className="text-gray-700 text-lg" />
          <input
            type="text"
            placeholder="Search something..."
            className="w-full bg-gray-300 text-black/80 focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={handleSearch} className="text-black/80">
            Search
          </button>
        </div>
      </section>

      <section id="categoryFood">
        <GoodsCluster />
      </section>

      <h1 className="text-center text-black/80">
        Appreciate your interest! This marks the end of the page.
      </h1>

      <div className="fixed bottom-24 justify-end flex right-5  z-50 w-full">
        <div
          className="rounded-full bg-green-700 px-2 py-2 text-white items-center justify-center flex"
          onClick={handleBackToTopClick}
        >
          <KeyboardArrowUpIcon fontSize="10px" />
        </div>
      </div>
    </main>
  );
};

export default HomeConsumer;
