import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import configFirebaseDB from '../Configuration/config';
import ChatIcon from '@mui/icons-material/Chat';
import { imageConfig, commodityTypes } from '../Configuration/config-file';
import { Link } from 'react-router-dom'; 

const StorePage = () => {
  const { storeID } = useParams();
  const [storeData, setStoreData] = useState(null);
  const [selectedCommodity, setSelectedCommodity] = useState("All Commodities");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchStoreData = async () => {
      const database = configFirebaseDB();
      const storeRef = ref(database, `kadiwa_users_account/${storeID}`);

      try {
        const storeSnapshot = await get(storeRef);

        if (storeSnapshot.exists()) {
          const storeInfo = storeSnapshot.val();
          setStoreData(storeInfo);
          setSelectedCommodity("All Commodities"); // Set a default value or adjust as needed
        } else {
          console.error(`Store with ID ${storeID} not found`);
        }
      } catch (error) {
        console.error('Error fetching store data:', error);
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

  // Extract storeContact from the storeData
  const storeContact = storeData.contact;
  
    if (!storeContact) {
      console.error('Cannot fetch and filter products: storeData.contact is null');
      return;
    }
  
    const productsRef = ref(configFirebaseDB(), 'product_inventory');
  
    get(productsRef)
      .then((snapshot) => {
        const productsData = snapshot.val() || {};
  
        // Assuming you have a specific node structure in your database
        const filteredProducts = Object.values(productsData)
          .filter((product) => {
            // Check if the product ID contains storeContact
            return product.id.includes(storeContact) && (commodityType === 'All Commodities' || product.commodity_type === commodityType);
          });
  
        setProducts(filteredProducts);
      })
      .catch((error) => {
        console.error('Error fetching and filtering products:', error);
      });
  };
  

  if (!storeData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen bg-gray-100 pt-1 ">
    <div className=' justify-between flex p-4 rounded-md bg-white shadow-md m-4'>
      <div>
        <h1 className='text-gray-700 font-bold text-lg'>{storeData.storeName}</h1>
        <p className='text-gray-500 text-sm'>{storeData.city + ', ' + storeData.province}</p>
        <p className='text-gray-500 text-sm'>Store Type: {storeData.storeType}</p>
        <p className='text-gray-500 text-sm'>{storeData.usertype}</p>
      </div>
      <Link to={`/route/chatpage/${storeID}`} className="text-green-600">
        <button><ChatIcon className='text-green-600'/></button>
      </Link>
    </div>
    <div className='flex justify-between mt-4 mx-4'>
      <div className='font-semibold text-gray-600'>
        <h1>Products</h1>
      </div>
      <div className=' space-x-2 '>
        <button className='bg-yellow-500 px-3 rounded-md text-white'>Buy</button>
        <button className='bg-green-500 px-3 rounded-md text-white'>Add to Cart</button>
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

    {/* Display filtered products */}
    <div id='Store List' className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 mb-18 ">
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
              {/* Adjust the link according to your route */}
              <Link
                to={`/main/productinfo/${product.product_code}`}
                className="text-xs font-semibold text-green-500 cursor-pointer border text-center border-green-600 p-2 rounded-md mt-1"
              >
                View
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
    <div className='p-16'>

    </div>
  </div>
  );
};

export default StorePage;
