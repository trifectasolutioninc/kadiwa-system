import React from 'react'
import { Input, Button } from '@mui/material';
import { Notifications, Settings, Add, Info, CreditCard, Link, History, LocalShipping, LocalMall, Done } from '@mui/icons-material';


const ProfileConsumer = () => {
  return (
    <div>
   
    <div className="px-4 flex justify-between">
      <h1 className="font-bold text-lg">Profile</h1>
      <div></div>
    </div>

    {/* Profile Information */}
    <div className="relative p-4 flex justify-between items-center bg-white m-4 rounded-md shadow-md">
      <div>
        {/* Display Picture */}
        <img id="profileImg" alt="Profile Picture" className="w-12 h-12 rounded-full" />
      </div>
      <div className="ml-4 mt-2">
        {/* Display Name */}
        <h1 id="fullname" className="font-bold text-lg">......</h1>
        {/* Display Contact */}
        <p id="contact" className="text-gray-600">......</p>
      </div>
      <div className="flex items-center">
        <div className="absolute top-0 right-0 p-2">
          {/* Display User Type */}
          <p id="typeofuser" className="rounded-3xl p-1 text-xs text-gray-800" style={{ backgroundColor: '#54FC6F' }}>Customer</p>
        </div>
        <div className="ml-2 mt-4">
          {/* Make the settings icon clickable */}
          <a href="../profile/viewprofiledetails.html">
            <Settings className="text-gray-500" />
          </a>
        </div>
      </div>
    </div>

    <div id="applyPartner" className="bg-green-300 mx-4 p-2 justify-between flex items-center rounded hidden">
      <span> Do you want to be Kadiwa Partner? Read more.</span>
      <Button className="bg-blue-500 p-1 text-white rounded">Apply</Button>
    </div>

    <div className="px-4 flex justify-between">
        <h1 className="font-bold text-lg">My Wallet</h1>
        <div></div>
      </div>

      <div className="p-4 flex justify-between bg-white m-4 rounded-md shadow-md">
        {/* Display PHP Amount */}
        <p id="balance" className="text-gray-600 font-semibold mr-2">PHP 0.00</p>
        {/* Plus Icon Circle */}
        <Add className="bg-green-500 text-white p-1 rounded-full" />
      </div>

      <div className="p-4 flex justify-between bg-white m-4 rounded-md shadow-md">
        {/* Display PHP Amount */}
        <p id="points" className="text-gray-600 font-semibold mr-2">KDW 0.00</p>
        {/* Plus Icon Circle */}
        <Info className="bg-green-500 text-white p-1 rounded-full" />
      </div>

      <div className="flex justify-around p-4">
        {/* Icon with Name: Virtual Card */}
        <div className="text-center">
          <a href="./card.html" className="block text-center">
            <CreditCard className="text-6xl text-gray-500 mb-2" />
            <p className="text-xs">Virtual Card</p>
          </a>
        </div>

        {/* Icon with Name: Linked Account */}
        <div className="text-center">
          <Link className="text-6xl text-gray-500 mb-2" />
          <p className="text-xs">Linked Account</p>
        </div>

        {/* Icon with Name: Transaction History */}
        <div className="text-center">
          <History className="text-6xl text-gray-500 mb-2" />
          <p className="text-xs">Transaction History</p>
        </div>
      </div>

      <div className="px-4 flex justify-between">
        <h1 className="font-bold text-lg">My Orders</h1>
        <div></div>
      </div>

      <div className="flex justify-around p-4">
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
  )
}

export default ProfileConsumer
