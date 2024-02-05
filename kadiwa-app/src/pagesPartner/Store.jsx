import React, { useState, useEffect } from 'react';
import { get, ref } from 'firebase/database';
import firebaseDB from '../Configuration/config-firebase2';
import { imageConfig } from '../Configuration/config-file'
import { MdEdit } from "react-icons/md";

const Store = () => {
  const [userDetails, setUserDetails] = useState(null);
  const kdwconnect = sessionStorage.getItem('kdwconnect');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await get(ref(firebaseDB, 'kadiwa_users_account'));
        const userData = snapshot.val();

        if (userData && userData[kdwconnect]) {
          setUserDetails(userData[kdwconnect]);
        } else {
          console.error('User not found');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (kdwconnect) {
      fetchData();
    }
  }, [kdwconnect]);

  return (
    <div className="container mx-auto p-4 bg-gray-100 h-screen">

      {userDetails && (
        <div className='h-auto'>
            <div className="container mx-auto p-4 bg-cover h-56 rounded-md shadow-lg flex items-end justify-between" style={{ backgroundImage: `url(${imageConfig.StoreBG})` }}>
                <div>
                  <p className="font-semibold text-white">{userDetails.storeName}</p> 
                  <p className=' text-xs text-white'>{userDetails.city}, {userDetails.province}</p>
                </div>
                <MdEdit className='text-white'/>
            </div>
            <div className='mt-4 mx-2'>
                <p className="mt-4 text-green-800 font-semibold text-sm">Owner Information</p> 
                <p className="">Name: <span className="font-semibold">{userDetails.fullname}</span></p> 
                <p className="">ID: <span className="font-semibold">{userDetails.id}</span></p> 
                <p className="mt-4 text-green-800 font-semibold text-sm">Contact</p> 
                <p className="">Phone No: <span className="font-semibold">{userDetails.contact}</span></p> 
                <p className="">Email: <span className="font-semibold">{userDetails.email}</span></p> 

            </div>
            <div>

            </div>

         
            
        </div>
        
      )}
    </div>
  );
};

export default Store;
