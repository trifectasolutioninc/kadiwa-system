import React, { useEffect, useState } from 'react';
import { imageConfig , commodityTypes } from '../Configuration/config-file';
import configFirebaseDB from '../Configuration/config';
import { ref, child, get } from 'firebase/database';


const LinkedAccount = () => {

  
  
    return (
        <div className="h-screen bg-gray-200">
        <div className="h-full overflow-y-auto p-4">
          <div className="flex justify-between">
            <h1 className="font-bold text-lg text-green-600">Linked Account</h1>
            <div> <span className="text-sm ">Change</span></div>
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
      

        </div>
      </div>
      
    );
  };

export default LinkedAccount
