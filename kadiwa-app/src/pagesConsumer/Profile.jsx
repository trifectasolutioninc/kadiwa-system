import React, { useEffect, useState } from 'react';
import { Add, Info, CreditCard, Link as LinkIcon, History, LocalShipping, LocalMall, Done, Settings, Store } from '@mui/icons-material';
import { Avatar, Badge } from '@mui/material';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import configFirebaseDB from '../Configuration/config';
import { ref, child, get } from 'firebase/database';
import redirectToIndexIfNoConnect from '../Scripts/connections/check';
import { FaBox } from "react-icons/fa";

const ProfileConsumer = () => {
  const [userData, setUserData] = useState(null);
  const [userwalletData, setUserWalletData] = useState(null);
  const [userstoreData, setUserstoreData] = useState(null);

  useEffect(() => {   
    const fetchUserData = async () => {
      if (!redirectToIndexIfNoConnect()) {
        return;
      }

      const database = configFirebaseDB();
      const usersAccountRef = ref(database, 'users_information');
      const usersWalletRef = ref(database, 'user_wallet');
      const usersStoreRef = ref(database, 'store_information');

      try {
        const uid = sessionStorage.getItem('uid');
        const sid = sessionStorage.getItem('sid');
        const userSnapshot = await get(child(usersAccountRef, uid));
        const userwalletSnapshot = await get(child(usersWalletRef, uid));
        const userstoreSnapshot = await get(child(usersStoreRef, sid));

        if ((userSnapshot.exists() && userwalletSnapshot.exists()) && userstoreSnapshot.exists() ) {
          const userData = userSnapshot.val();
          const userWalletData = userwalletSnapshot.val();
          const userstoreData = userstoreSnapshot.val();
          setUserData(userData);
          setUserWalletData(userWalletData);
          setUserstoreData(userstoreData);
          updateHTMLWithUserData(userData); // Call the function to update HTML
        } else {
          console.error('User not found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const updateHTMLWithUserData = (userData) => {
      if (!userData) {
        return;
      }
    
      const typeofuserElement = document.getElementById('typeofuser');
      const fullnameElement = document.getElementById('fullname');
      const contactElement = document.getElementById('contact');
      const balanceElement = document.getElementById('balance');
      const ptsElement = document.getElementById('points');
      const applyPartnerElement = document.getElementById('applyPartner');
      const storePartnerElement = document.getElementById('storePartner');
      const storeNameElement = document.getElementById('storeName');
    
      if (typeofuserElement) {
        typeofuserElement.textContent = userData.type || 'No UserType';
      }

      if (storeNameElement) {
        storeNameElement.textContent = userstoreData.name || 'No Store';
      }
    
      if (fullnameElement) {
        fullnameElement.textContent = userData.first_name + " " + userData.last_name || 'No Name';
      }
    
      if (contactElement) {
        contactElement.textContent = userData.contact || 'No Contact';
      }
    
      if (balanceElement) {
        balanceElement.textContent = `PHP ${userwalletData.balance}`;
      }
    
      if (ptsElement) {
        ptsElement.textContent = `KDW ${userwalletData.points}`;
      }
    
      if (applyPartnerElement && storePartnerElement) {
        if (userData.type === 'consumer') {
          applyPartnerElement.classList.remove('hidden');
          storePartnerElement.classList.add('hidden');
        } else if (userData.type === 'partner') {
          applyPartnerElement.classList.add('hidden');
          storePartnerElement.classList.remove('hidden');
        }
      }
    };
    
    const interval = setInterval(fetchUserData, 5000); // Fetch data every minute
    
    fetchUserData(); // Fetch data initially
    
    return () => clearInterval(interval); // Clean up interval on component unmount
  }, []);
  return (
    <div className="h-auto bg-gray-100">
      <div className="p-4 flex justify-between">
        <h1 className="font-bold text-lg text-green-700">Profile</h1>
        <div></div>
      </div>

      {/* Profile Information */}
      {userData && (
        <div className="relative p-4 flex justify-between items-center bg-white m-4 rounded-md shadow-md">
          <div>
            {/* Display Picture */}
            <Avatar className="w-12 h-12 rounded-full" />
          </div>
          <div className="ml-4 mt-2">
            {/* Display Name */}
            <h1 id="fullname" className="font-bold text-lg">
              {userData.fullname}
            </h1>
            {/* Display Contact */}
            <p id="contact" className="text-gray-600">
              {userData.contact}
            </p>
          </div>
          <div className="flex items-center">
            <div className="absolute top-0 right-0 p-2">
              {/* Display User Type */}
              <p
                id="typeofuser"
                className="rounded-3xl p-1 text-xs text-gray-800"
                style={{ backgroundColor: '#54FC6F' }}
              >
                {userData.usertype}
              </p>
            </div>
            <div className="ml-2 mt-4">
              {/* Make the settings icon clickable */}
              <Link to="/route/profileinfo">
                <Settings className="text-gray-500" />
              </Link>
            </div>
          </div>
        </div>
      )}

      <div id="applyPartner" className="bg-green-300 mx-4 p-2 justify-between flex items-center rounded ">
        <span> Do you want to be Kadiwa Partner? Read more.</span>
        <Button className="bg-blue-500 p-1 text-white rounded">Apply</Button>
      </div>

      <div id="storePartner" className="bg-white mx-4 p-2 flex justify-between items-center rounded ">
        <div className='flex justify-center items-center'>
          <Store className=" text-gray-500"/>
          <span id='storeName' className="flex text-gray-700 font-bold">....</span>

        </div>
        
        <Link to="/partner/home" id="storeButton" className="bg-blue-500 py-1 px-4 text-white rounded ">Store</Link>
      </div>

      <div className="px-4 flex justify-between mt-4">
        <h1 className="font-bold text-lg text-gray-800">My Wallet</h1>
        <div></div>
      </div>

      {userwalletData && (
        <div className="p-4 flex justify-between bg-white m-4 rounded-md shadow-md">
          {/* Display PHP Amount */}
          <p id="balance" className="text-gray-600 font-semibold mr-2">
            PHP {userwalletData.balance}
          </p>
          {/* Plus Icon Circle */}
          <Add className="bg-green-500 text-white p-1 rounded-full" />
        </div>
      )}

      {userwalletData && (
        <div className="p-4 flex justify-between bg-white m-4 rounded-md shadow-md">
          {/* Display PHP Amount */}
          <p id="points" className="text-gray-600 font-semibold mr-2">
            KDW {userwalletData.points}
          </p>
          {/* Plus Icon Circle */}
          <Info className="bg-green-500 text-white p-1 rounded-full" />
        </div>
      )}

      <div className="flex justify-around px-4 py-8">
        {/* Icon with Name: Virtual Card */}
        <div className="text-center">
        <Link to="/main/virtual-card" className="block text-center">
          <CreditCard className="text-6xl text-gray-500 mb-2" />
          <p className="text-xs">Virtual Card</p>
        </Link>
      </div>

        {/* Icon with Name: Linked Account */}
        <div className="text-center">
          <Link to="/main/linked-account" className="block text-center">
            <LinkIcon className="text-6xl text-gray-500 mb-2" />
            <p className="text-xs">Linked Account</p>
          </Link>
        </div>


        {/* Icon with Name: Transaction History */}
        <div className="text-center">
          <History className="text-6xl text-gray-500 mb-2" />
          <p className="text-xs">Transaction History</p>
        </div>
      </div>

      <div className="px-4 flex justify-between">
        <h1 className="font-bold text-lg text-gray-800">My Orders</h1>
        <div></div>
      </div>
      <p className='text-xs font-bold text-green-700 mx-4 mt-4'>Online</p>
      <div className=' h-0.5 bg-gray-300 mx-4'></div>
      <div className="flex justify-around px-4 py-2">
        {/* Icon with Name: To Ship */}
        <div className="text-center">
          <LocalShipping className="text-3xl text-gray-500 mb-2" />
          <p className="text-sm">To Ship</p>
        </div>

        {/* Icon with Name: To Received */}
        <div className="text-center">
          <LocalMall className="text-3xl text-gray-500 mb-2" />
          <p className="text-sm">To Received</p>
        </div>

        {/* Icon with Name: Complete */}
        <div className="text-center">
          <Done className="text-3xl text-gray-500 mb-2" />
          <p className="text-sm">Complete</p>
        </div>
      </div>
      <p className='text-xs font-bold text-green-700 mx-4 mt-4'>Pickup</p>
      <div className=' h-0.5 bg-gray-300 mx-4'></div>
      <div className="flex justify-around px-4 py-2">
        {/* Icon with Name: To Ship */}
        <Link to={'/main/pickup/pending'} className="text-center items-center">
          <FaBox className="text-lg text-gray-500 mb-3 mt-0.5 mx-auto" />
          <p className="text-sm">Orders</p>
        </Link>
        {/* Icon with Name: Complete */}

        <Link to={'/main/pickup/complete'} className="text-center">
          <Done className="text-3xl text-gray-500 mb-2" />
          <p className="text-sm">Complete</p>
        </Link>
      </div>
      <div className='p-2 h-32'> 

      </div>
    </div>
  );
};

export default ProfileConsumer;
