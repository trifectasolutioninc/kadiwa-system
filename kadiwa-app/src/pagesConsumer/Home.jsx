// Import necessary modules
import React, { useState, useEffect } from 'react';
import { LocationOn, Search, Notifications } from '@mui/icons-material';
import { imageConfig , commodityTypes } from '../Configuration/config-file';
import configFirebaseDB from '../Configuration/config';
import { ref, child, get } from 'firebase/database';

const HomeConsumer = () => {

  const [selectedCommodity, setSelectedCommodity] = useState("All Commodities");
  const [products, setProducts] = useState([]);
  const database = configFirebaseDB();

  useEffect(() => {
    // Fetch and display products initially
    displayProducts(selectedCommodity);
  }, [selectedCommodity]);

  const handleCommodityClick = (commodityType) => {
    setSelectedCommodity(commodityType);
  };

  const displayProducts = (commodityType) => {
    const productsRef = ref(database, 'products_info');
        // Use the 'value' event to fetch data once
    get(productsRef).then((snapshot) => {
        const productsData = snapshot.val() || {};
    
        // Assuming you have a specific node structure in your database
        const filteredProducts = Object.values(productsData)
            .filter(product => commodityType === 'All Commodities' || product.commodity_type === commodityType);
    
        setProducts(filteredProducts);
        }).catch(error => {
        console.error('Error fetching and filtering products:', error);
        });
  };

  const handleViewButtonClick = (product) => {
    // Navigate to the product-details.html page and pass the product details as query parameters
    window.location.href = `product-description.html?productCode=${product.product_code}&productName=${encodeURIComponent(product.product_name)}`;
  };
  

  return (
    <div>
        <div id="topView" className="p-4">
        <h1 className="text-green-700 font-bold">Hello Kadiwa User!</h1>
        <div id="userLocation" className="flex items-center mb-2 text-xs">
          <LocationOn className="text-gray-700 mr-2" />
          <span id="userLocationText" className="text-gray-600">Loading...</span>
        </div>
      </div>

      <div className="px-4 flex items-center justify-around ">
        <div className="flex-grow flex items-center">
          <div className="relative flex items-center bg-gray-300 rounded-md p-2 flex-grow">
            <Search className="text-gray-700 text-lg mr-2" />
            <input type="text" placeholder="Search..." className="w-full bg-gray-300 text-gray-600 focus:outline-none" />
          </div>
        </div>

        <div className="ml-4">
          <Notifications className="text-gray-700 text-lg" />
        </div>
      </div>

      <div className="overflow-x-auto w-screen flex px-2">
        {commodityTypes.map((commodityType, index) => (
          <button
            key={index}
            className={`border-green-700 border ${selectedCommodity === commodityType ? 'bg-green-700 text-white' : 'text-green-700'} text-xs rounded py-2 px-4 m-2 w-auto whitespace-nowrap tab-button`}
            data-commodity-type={commodityType}
            onClick={() => handleCommodityClick(commodityType)}
          >
            {commodityType}
          </button>
        ))}
      </div>

      <div id="productlist" className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 mb-16">
        {products.map((product, index) => (
          <div key={index} className="container mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-full">
              <div className="text-left h-1/2">
                <img
                  id={`product${product.product_code}`}
                  alt={product.product_name}
                  className="h-full w-full object-cover"
                  src={imageConfig[product.keywords.toLowerCase()]}
                />
              </div>
              <div className="text-left h-1/2 flex flex-col justify-end p-2">
                <h2 className="text-xs font-semibold">{product.product_name}</h2>
                <p className="text-xs font-semibold text-gray-500">{product.commodity_type}</p>
                <p className="text-xs font-bold text-green-600">Php {product.price.toFixed(2)}</p>
                <button
                  className="text-xs font-semibold text-green-500 cursor-pointer border border-green-600 p-2 rounded-md mt-1"
                  onClick={() => handleViewButtonClick(product)}
                >
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  )
}

export default HomeConsumer
