// SearchPage.js

import React, { useEffect, useState } from "react";
import { useLocation, NavLink, Link } from "react-router-dom";
import { ref, get } from "firebase/database";
import { IoMdArrowRoundBack } from "react-icons/io";
import { IoChevronBack } from "react-icons/io5";
import { Search } from "@mui/icons-material";
import firebaseDB from "../../Configuration/config";

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const database = firebaseDB();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const query = queryParams.get("query");
    if (query) {
      setSearchQuery(query);
      searchProducts(query);
    }
  }, [location.search]);

  const searchProducts = (query) => {
    const productsRef = ref(database, "products_info");
    get(productsRef)
      .then((snapshot) => {
        const productsData = snapshot.val() || {};
        const results = Object.values(productsData).filter(
          (product) =>
            product.product_name.toLowerCase().includes(query.toLowerCase()) ||
            product.commodity_type.toLowerCase().includes(query.toLowerCase()) ||
            product.keywords.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(results);
      })
      .catch((error) => {
        console.error("Error searching products:", error);
      });
  };

  const handleSearch = () => {
    // Handle search logic here
    searchProducts(searchQuery);
  };

  return (
    <>
   
    <section className="sticky top-0 right-0 left-0 p-1 bg-neutral-100 ">
      <div className="relative flex items-center bg-gray-300 rounded-md p-2 w-full">
      <NavLink to={"/main"} className="">
        <IoChevronBack fontSize={"25px"} />
      </NavLink>
       
        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-gray-300 text-black/80 focus:outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {/* Display search results below */}
      <ul>
        {searchResults.map((product) => (
            <Link to={`/main/productinfo/${product.product_code}/home`}>

<div>
                       <div key={product.product_code} className=" bg-white px-4 flex justify-between py-1">
            <div>
            <p className=" font-semibold text-gray-700">{product.product_name}</p>
            </div>
            <div>
            <p className=" px-2 bg-green-200 text-gray-600 rounded-lg">{product.category}</p>
            </div>
          
            
       
        
          </div>
          <hr />

            </div>
            
            </Link>
           
       ))}
      </ul>
    </section>
    </>
  );
};

export default SearchPage;
