import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import configFirebaseDB from '../Configuration/config';
import ChatIcon from '@mui/icons-material/Chat';
import { imageConfig, commodityTypes } from '../Configuration/config-file';
import { Link } from 'react-router-dom'; 

const StoreInfo = () => {
  const { productCode } = useParams();
  const [storeData, setStoreData] = useState(null);
  const kdwconnect = sessionStorage.getItem('kdwconnect');
  const kdwowner = productCode.split('-')[0];
  useEffect(() => {
    const fetchStoreData = async () => {
      const database = configFirebaseDB();
      const storeRef = ref(database, `kadiwa_users_account/${kdwowner}`);

      try {
        const storeSnapshot = await get(storeRef);

        if (storeSnapshot.exists()) {
          const storeInfo = storeSnapshot.val();
          setStoreData(storeInfo);
        } else {
          console.error(`Store with ID ${kdwowner} not found`);
        }
      } catch (error) {
        console.error('Error fetching store data:', error);
      }
    };

    fetchStoreData();
  }, [productCode]);

  

  if (!storeData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="">
    <div className=' justify-between flex p-4 rounded-md   m-4'>
      <div>
        <h1 className='text-gray-700 font-bold text-lg'>{storeData.storeName}</h1>
        <p className='text-gray-500 text-sm'>{storeData.city + ', ' + storeData.province}</p>
      </div>
      <Link to={`/route/chatpage/${productCode}`} className="">
        <button className='bg-green-700 text-white rounded-xl px-2'>Visit</button>
      </Link>
    </div>
  </div>
  );
};

export default StoreInfo;
