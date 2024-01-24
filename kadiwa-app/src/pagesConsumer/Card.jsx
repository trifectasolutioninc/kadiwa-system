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
      
        QRCode.toCanvas(qrCodeCanvas, userData.id, { width: 200, height: 200 }, function (error) {
          if (error) console.error('Error generating QR code:', error);
        });
      };
      
      
  
      fetchUserData();
    }, []);
  
  
    return (
        <div className="h-screen bg-gray-100">
        <div className="h-full overflow-y-auto p-4">
          <div className="flex justify-between">
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

          <div className='flex justify-between items-center px-4'>
            <p className='font-bold text-gray-700 '>Kadiwa Card</p>
            <button className='border border-green-700 border-2 p-1 rounded-md text-xs text-green-700'>Read More</button>
          </div>
      
      
          <div className="flex justify-center items-center p-5">
            <div className="text-center bg-white p-4 rounded-2xl mb-16">
              {/* QR Code Title */}
              <h1 className="text-xl font-bold mb-2">QR Code</h1>
      
              {/* QR Code Canvas */}
              <canvas id="qrCodeCanvas" className="mx-auto"></canvas>
            </div>
          </div>
        </div>
      </div>
      
    );
  };

export default Card
