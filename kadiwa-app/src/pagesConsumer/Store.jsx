import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Notifications } from '@mui/icons-material';
import { ref, child, get } from 'firebase/database';
import redirectToIndexIfNoConnect from '../Scripts/connections/check';
import configFirebaseDB from '../Configuration/config';
import { IoMdArrowRoundBack } from "react-icons/io";

const StoreConsumer = () => {
  const [storeList, setStoreList] = useState([]);


  useEffect(() => {
    const fetchStores = async () => {
      const database = configFirebaseDB();
      const storeRef = ref(database, 'store_information');

      try {
        const storeSnapshot = await get(storeRef);

        if (storeSnapshot.exists()) {
          const stores = Object.values(storeSnapshot.val());
          setStoreList(stores);
        } else {
          console.error('No stores found');
        }
      } catch (error) {
        console.error('Error fetching store data:', error);
      }
    };

    fetchStores();
  }, []);

  


  return (
    <div className="h-screen bg-gray-100">
      <div className='flex pt-4 mb-1 items-center '>
        <NavLink to={"/main"} className='px-4'>
          <IoMdArrowRoundBack />
        </NavLink>
        <h1 className="text-lg text-green-600  font-bold">Store</h1>

      </div>
      {/* Top Navigation with Search and Notification */}
      <div className="p-4 flex items-center justify-between bg-gray-100">
        {/* Search Input */}
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Search..."
            className="w-full border p-2 rounded-md bg-gray-300 text-gray-600 focus:outline-none"
          />
        </div>

        {/* Notification Icon */}
        <div className="ml-4">
          <Notifications className="text-gray-700" />
        </div>
      </div>

      

      {/* Body Content */}
      <div className="container mx-auto mb-16">
        {/* Store List */}
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-1">
          {storeList.map((store) => (
            // Conditionally render the container only for stores with 'usertype' as 'Partner'
            store.status === 'open' && (
              <div key={store.id} className="bg-white p-4 rounded-lg shadow-md m-2 items-center grid grid-cols-10">
                   {/* <img src={store.logo} alt={`Store ${store.id} Logo`} className="mr-4 col-span-2" /> */}
                  <div className='col-span-9 text-left'>
                 
                    <p className=" font-semibold">{store.name}</p>
                    <p className="text-xs text-gray-500">{store.type}</p>
                    <p className="text-xs text-gray-500">Partner</p>

                  </div>
                  <div className='col-span-1 flex justify-end '>
                  <Link to={`/main/storepage/${store.id}`} className='text-center rounded-md bg-green-700 text-white px-4'>Visit</Link>
                  </div>
            
              </div>
            )
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StoreConsumer;
