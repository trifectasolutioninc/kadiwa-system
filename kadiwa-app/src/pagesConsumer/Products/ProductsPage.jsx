import React, { useEffect, useState } from "react";
import { useParams, NavLink, Link, useLocation } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { getDatabase, ref, get } from "firebase/database";
import { imageConfig } from "../../Configuration/config-file";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import BackButton from "../BackToHome";

const ProductsPage = () => {
  const { category } = useParams();
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState(""); // State for sorting
  const [isFabVisible, setIsFabVisible] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const location = useLocation();
  const home_position = sessionStorage.getItem("home_position");
  const [scrollPositions, setScrollPositions] = useState({});

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const db = getDatabase();
        const subcategoriesRef = ref(db, "products_info");
        const snapshot = await get(subcategoriesRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          const subcategoriesData = Object.values(data)
            .filter((product) => product.category === category)
            .map((product) => product.subcategory);
          const uniqueSubcategories = Array.from(new Set(subcategoriesData));
          setSubcategories(uniqueSubcategories);
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    fetchSubcategories();
  }, [category]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const db = getDatabase();
        const productsRef = ref(db, "products_info");
        const snapshot = await get(productsRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          const filteredProducts = Object.values(data).filter((product) =>
            selectedSubcategory
              ? product.subcategory === selectedSubcategory
              : product.category === category.toLowerCase()
          );
          setProducts(filteredProducts);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [category, selectedSubcategory]);

  useEffect(() => {
    // Delayed smooth scroll to the stored position
    const storedPosition = JSON.parse(home_position);
    const scrollPosition =
      storedPosition?.scrollPosition ||
      scrollPositions[location.pathname]?.scrollPosition;

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

    const delay = 800;

    const timeoutId = setTimeout(scrollToStoredPosition, delay);

    return () => clearTimeout(timeoutId); // Cleanup the timeout on component unmount
  }, [sortBy, location.pathname, scrollPositions]);

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

  const handleSubcategoryClick = (subcategory) => {
    setSelectedSubcategory(subcategory);
  };

  const handleProductLinkClick = (productCode) => {
    // Store scroll position and product code when clicking a product link
    const scrollPosition = window.scrollY;
    sessionStorage.setItem(
      "home_position",
      JSON.stringify({ scrollPosition, productCode })
    );
    setScrollPositions((prevScrollPositions) => ({
      ...prevScrollPositions,
      [location.pathname]: { scrollPosition, productCode },
    }));
  };

  const handleSortChange = (e) => {
    const selectedValue = e.target.value;
    setSortBy(selectedValue);
    // Sort products based on selected sorting option
    if (selectedValue === "priceHighToLow") {
      const sortedProducts = [...products].sort((a, b) => b.price - a.price);
      setProducts(sortedProducts);
    } else if (selectedValue === "priceLowToHigh") {
      const sortedProducts = [...products].sort((a, b) => a.price - b.price);
      setProducts(sortedProducts);
    }
  };
  return (
    <>
      <div className="bg-neutral-100">
        <div className="fixed gap-5 bg-green-700 w-full top-0 p-3 right-0 left-0 z-10 shadow-md">
          <div className=" flex items-center justify-between">
            <div className="flex items-center gap-5">
              <BackButton />

              <h1 className="text-xl text-neutral-100 font-bold">Products</h1>
            </div>
            {/* Sorting Dropdown */}
            <select
              className="border border-green-700 rounded-md px-2 py-1 mr-3"
              value={sortBy}
              onChange={handleSortChange}
            >
              <option value="">Sort Product By</option>
              <option value="priceHighToLow">Price (High to Low)</option>
              <option value="priceLowToHigh">Price (Low to High)</option>
            </select>
          </div>
        </div>
        <div className=" h-16"></div>

        <main className="p-3 md:px-10 space-y-5 mb-24 ">
          <section className="overflow-x-auto flex gap-3">
            {/* Button to show all products */}
            <button
              onClick={() => setSelectedSubcategory(null)}
              className={` border-green-700 border
                            ${
                              selectedSubcategory === null
                                ? " bg-green-700 text-white"
                                : " text-green-700 bg-white"
                            } 
                             rounded py-2 px-6 w-auto whitespace-nowrap tab-button`}
            >
              All
            </button>
            {/* Subcategory buttons */}
            {subcategories
              .sort((a, b) => {
                // Move "Other" subcategory to the end
                if (a === "other") return 1;
                if (b === "other") return -1;
                return 0;
              })
              .map((subcategory) => {
                // Exclude subcategory if it's the same as the category
                if (subcategory === category) return null;

                return (
                  <button
                    key={subcategory}
                    onClick={() => handleSubcategoryClick(subcategory)}
                    className={`w-full border-green-700 border
                ${
                  selectedSubcategory === subcategory
                    ? " bg-green-700 text-white"
                    : " text-green-700 bg-white"
                } 
                rounded py-2 px-4 w-auto whitespace-nowrap tab-button`}
                  >
                    {subcategory.charAt(0).toUpperCase() + subcategory.slice(1)}
                  </button>
                );
              })}
          </section>
          {/* Display Products */}
          <section
            id="productlist"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
          >
            {products.map((product, index) => (
              <div
                key={index}
                className="container bg-slate-50 rounded-lg shadow-md border relative"
              >
                <Link
                  to={`/main/productinfo/${product.product_code}/${category}`}
                  onClick={() => handleProductLinkClick(product.product_code)}
                  className="flex flex-col"
                >
                  <div className="absolute top-2 right-2 bg-green-500 text-white py-1 px-2 rounded-md">
                    New
                  </div>
                  <div className="h-52 overflow-hidden">
                    <img
                      id={`product${product.product_code}`}
                      alt={product.product_name}
                      className="w-full h-full object-cover rounded-md"
                      src={imageConfig[product.keywords.toLowerCase()]}
                      loading="lazy"
                    />
                  </div>
                  <div className="p-2">
                    <h2 className="text-black/80 text-lg font-bold truncate">
                      {product.product_name}
                    </h2>
                    <p className="font-medium text-gray-500 truncate">
                      {product.subcategory.charAt(0).toUpperCase() +
                        product.subcategory.slice(1)}
                    </p>
                    <p className="font-bold text-green-600">
                      Php {product.price.toFixed(2)}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </section>
          <h1 className="text-center text-black/80 mt-8">
            Appreciate your interest! This marks the end of the page.
          </h1>
        </main>
        <div className="fixed bottom-24 justify-end flex right-5  z-50 w-full">
          <div
            className="rounded-full bg-green-700 px-2 py-2 text-white items-center justify-center flex"
            onClick={handleBackToTopClick}
          >
            <KeyboardArrowUpIcon fontSize="10px" />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductsPage;
