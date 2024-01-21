import React, { useState } from 'react';
import { LocationOn, Search, Notifications } from '@mui/icons-material';


const HomeConsumer = () => {

    const [selectedCommodity, setSelectedCommodity] = useState("All"); // Default selected commodity

    const handleCommodityClick = (commodityType) => {
      setSelectedCommodity(commodityType);
      // Add logic to fetch and display products based on the selected commodity
    };
  
    const commodityTypes = [
      "All Commodities",
      "Rice",
      "Corn",
      "Fish",
      "Live Stock and Poultry Products",
      "Vegetables",
      "Spices",
      "Fruits",
      "Other Basic Commodities"
    ];

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
        {/* ...Product List... */}
      </div>
    </div>
  )
}

export default HomeConsumer
