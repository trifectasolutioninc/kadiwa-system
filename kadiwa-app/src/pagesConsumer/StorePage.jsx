import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams
import { ref, get } from 'firebase/database';
import configFirebaseDB from '../Configuration/config';
import ChatIcon from '@mui/icons-material/Chat';

const StorePage = () => {
  const { storeID } = useParams(); // Get storeID from the URL params
  const [storeData, setStoreData] = useState(null);

  useEffect(() => {
    const fetchStoreData = async () => {
      const database = configFirebaseDB();
      const storeRef = ref(database, `kadiwa_users_account/${storeID}`);

      try {
        const storeSnapshot = await get(storeRef);

        if (storeSnapshot.exists()) {
          const storeInfo = storeSnapshot.val();
          setStoreData(storeInfo);
        } else {
          console.error(`Store with ID ${storeID} not found`);
        }
      } catch (error) {
        console.error('Error fetching store data:', error);
      }
    };

    fetchStoreData();
  }, [storeID]);

  if (!storeData) {
    // Loading state or handle when storeData is not available
    return <div>Loading...</div>;
  }

  return (
    <div className="h-screen bg-gray-100 p-4"> 
        <div className=' justify-between flex p-4 rounded-md bg-white shadow-md '>
            <div>
                <h1 className='text-gray-700 font-bold text-lg'>{storeData.storeName}</h1>
                <p className='text-gray-500 text-sm'>{storeData.city + ', ' + storeData.province}</p>
                <p className='text-gray-500 text-sm'>Store Type: {storeData.storeType}</p>
                <p className='text-gray-500 text-sm'>{storeData.usertype}</p>

            </div>
            <div>
                <button><ChatIcon className='text-green-600'/></button>
            </div>

        </div>
        <div className='flex justify-between mt-4 mx-2'>
            <div className='font-semibold text-gray-600'>
                <h1>Products</h1>
            </div>
            <div className=' space-x-2 '>
                <button className='bg-yellow-500 px-3 rounded-md text-white'>Buy</button>
                <button className='bg-green-500 px-3 rounded-md text-white'>Add to Cart</button>
            </div>

        </div>
      
      
    </div>
  );
};

export default StorePage;
