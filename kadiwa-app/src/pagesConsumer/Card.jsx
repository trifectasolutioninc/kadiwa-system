import React, { useEffect, useState } from 'react';
import { imageConfig , commodityTypes } from '../Configuration/config-file';
import configFirebaseDB from '../Configuration/config';
import { ref, child, get } from 'firebase/database';
import QRCode from 'qrcode';

const Card = () => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
      const fetchUserData = async () => {
        const kdwconnect = sessionStorage.getItem('kdwconnect');
        const database = configFirebaseDB();
        const userRef = ref(database, `kadiwa_users_account/${kdwconnect}`);
  
        try {
          const userSnapshot = await get(userRef);
  
          if (userSnapshot.exists()) {
            const userData = userSnapshot.val();
            setUserData(userData);
            updateHTMLWithUserData(userData);
          } else {
            console.error('User not found');
          }
        } catch (error) {
          console.error('Error fetching user information:', error);
        }
      };
  
      const updateHTMLWithUserData = (userData) => {
        document.getElementById('cardid').innerText = userData.id.replace(/-/g, ' ');
        document.getElementById('cardowner').innerText = userData.fullname;
      
        const qrCodeCanvas = document.getElementById('qrCodeCanvas');
      
        QRCode.toCanvas(qrCodeCanvas, userData.id, { width: 250, height: 250 }, function (error) {
          if (error) console.error('Error generating QR code:', error);
        });
      };
      
      
  
      fetchUserData();
    }, []);
  
  
    return (
      <div className="h-screen bg-gray-200">
        
  
        <div className="p-4 flex justify-between">
          <h1 className="font-bold text-lg">Virtual Card</h1>
          <div></div>
        </div>
  
        <div className="relative max-w-md bg-cover bg-center rounded-lg overflow-hidden m-4">
          {/* Background Image */}
          <img src={imageConfig.cardbg} alt="Background Image" className="w-full h-full object-cover" />
  
          <div className="absolute inset-0 bg-black bg-opacity-40 p-4 flex flex-col justify-end">
            {/* Kadiwa Logo */}
            <img src={imageConfig.AppLogo} alt="Kadiwa Logo" className="h-16 w-16" />
  
            {/* Card Details */}
            <div className="text-white">
              <p id="cardid" className="text-2xl font-semibold mb-2">.... .... .... ....</p>
            </div>
  
            <div className="flex justify-between">
              {/* Card Owner Information */}
              <span id="cardowner" className="text-white text-xs">......</span>
  
              {/* Card Security Dots */}
              <span className="text-white">⬤ ⬤ ⬤</span>
            </div>
          </div>
        </div>
  
        <div className="px-4 flex justify-between">
          <h1 className="font-bold text-sm">Linked Account</h1>
          <div>
            <span className="text-sm ">Change</span>
          </div>
        </div>
  
        <div className="bg-white shadow-lg rounded-2xl m-4">
          <div className="p-4">
            <div className="justify-between flex">
              {/* Linked Account Owner */}
              <span className="font-bold text-sm">Juan Dela Cruz</span>
  
              {/* Linked Account Number */}
              <span className="font-bold text-sm">1234 5678 9123 4567</span>
            </div>
  
            {/* Linked Account Type */}
            <span className="text-sm">MasterCard</span>
          </div>
        </div>
  
        <div className="flex justify-center items-center ">
            <div className="text-center mb-4 bg-white p-4 rounded-2xl">
                {/* QR Code Title */}
                <h1 className="text-xl font-bold mb-2">QR Code</h1>

                {/* QR Code Canvas */}
                <canvas id="qrCodeCanvas" className=" mx-auto"></canvas>
            </div>

        </div>
      </div>
    );
  };

export default Card
