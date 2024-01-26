import React, { useEffect, useState } from 'react';
import { Add, Info, CreditCard, Link as LinkIcon, History, LocalShipping, LocalMall, Done, Settings, Store } from '@mui/icons-material';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import configFirebaseDB from '../Configuration/config';
import { ref, child, get } from 'firebase/database';
import redirectToIndexIfNoConnect from '../Scripts/connections/check';

const ProfileConsumer = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {   
    const fetchUserData = async () => {
      if (!redirectToIndexIfNoConnect()) {
        return;
      }

      const database = configFirebaseDB();
      const usersAccountRef = ref(database, 'kadiwa_users_account');

      try {
        const kdwconnect = sessionStorage.getItem('kdwconnect');
        const userSnapshot = await get(child(usersAccountRef, kdwconnect));

        if (userSnapshot.exists()) {
          const userData = userSnapshot.val();
          setUserData(userData);
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
    
      if (typeofuserElement) {
        typeofuserElement.textContent = userData.usertype || 'No UserType';
      }
    
      if (fullnameElement) {
        fullnameElement.textContent = userData.fullname || 'No Name';
      }
    
      if (contactElement) {
        contactElement.textContent = userData.contact || 'No Contact';
      }
    
      if (balanceElement) {
        balanceElement.textContent = `PHP ${userData.balance.toFixed(2)}`;
      }
    
      if (ptsElement) {
        ptsElement.textContent = `KDW ${userData.points.toFixed(2)}`;
      }
    
      if (applyPartnerElement && storePartnerElement) {
        if (userData.usertype === 'Consumer') {
          applyPartnerElement.classList.remove('hidden');
          storePartnerElement.classList.add('hidden');
        } else if (userData.usertype === 'Partner') {
          applyPartnerElement.classList.add('hidden');
          storePartnerElement.classList.remove('hidden');
        }
      }
    };
    

    fetchUserData();
  }, []);

  return (
    <div className="h-screen bg-gray-100">
      <div className="p-4 flex justify-between">
        <h1 className="font-bold text-lg text-green-700">Profile</h1>
        <div></div>
      </div>

      {/* Profile Information */}
      {userData && (
        <div className="relative p-4 flex justify-between items-center bg-white m-4 rounded-md shadow-md">
          <div>
            {/* Display Picture */}
            <img
              id="profileImg"
              alt="Profile Picture"
              className="w-12 h-12 rounded-full"
            />
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
        <span className="flex text-gray-700 font-bold"><Store className=" text-gray-500"/>SarisariStore</span>
        <Link to="/partner/home" id="storeButton" className="bg-blue-500 py-1 px-4 text-white rounded ">Store</Link>
      </div>

      <div className="px-4 flex justify-between mt-4">
        <h1 className="font-bold text-lg text-gray-800">My Wallet</h1>
        <div></div>
      </div>

      {userData && (
        <div className="p-4 flex justify-between bg-white m-4 rounded-md shadow-md">
          {/* Display PHP Amount */}
          <p id="balance" className="text-gray-600 font-semibold mr-2">
            PHP {userData.balance.toFixed(2)}
          </p>
          {/* Plus Icon Circle */}
          <Add className="bg-green-500 text-white p-1 rounded-full" />
        </div>
      )}

      {userData && (
        <div className="p-4 flex justify-between bg-white m-4 rounded-md shadow-md">
          {/* Display PHP Amount */}
          <p id="points" className="text-gray-600 font-semibold mr-2">
            KDW {userData.points.toFixed(2)}
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

      <div className="flex justify-around px-4 py-8">
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
    </div>
  );
};

export default ProfileConsumer;
