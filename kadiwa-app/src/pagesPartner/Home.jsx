import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Grid, TextField, p } from '@mui/material';
import {
  LocalShipping,
  Cancel,
  ArrowBack,
  Star,
  AttachMoney,
  CreditCard,
  Payment,
  Receipt,
  Inbox,
  ShoppingCart,
  InsertChart,
  Store,
  Logout,
} from '@mui/icons-material';

const Home = () => {
  const setSessionAndRedirect = (path) => {
    // Implement your session logic and redirection
    console.log('Setting session and redirecting to:', path);
  };

  const updateDate = () => {
    // Implement your date update logic
    console.log('Updating date...');
  };

  const logoutUser = () => {
    window.location.href = '/main/profile';
  };

  return (
    <div className="p-4 flex-grow overflow-y-auto mb-16">
      {/* Top Navigation with Search and Notification */}
      <div className="p-4 flex items-center justify-between bg-gray-100">
        {/* Search Input */}
        <div className="flex-grow">
          <p variant="h6" className="flex text-gray-700 font-bold">
            <Store sx={{ color: 'gray.500', mr: 1 }} />
            SarisariStore
          </p>
        </div>

        {/* Notification Icon */}
        <div className="ml-4">
          <Logout sx={{ color: 'gray.700', cursor: 'pointer' }} onClick={logoutUser} />
        </div>
      </div>

      {/* ... (Other content) */}

           {/* Order Status Icons with Numbers */}
           <div className="p-4">
        <div className="grid grid-cols-4 md:grid-cols-4 gap-1">
          {/* To Ship Icon */}
          <div className="flex flex-col items-center bg-white p-1 rounded text-green-800">
            <LocalShipping />
            <span className="text-xs">To Ship</span>
            <div className="w-full bg-green-300 h-0.5"></div>
            <span className="text-lg font-bold">0</span>
          </div>

          {/* Cancelled Icon */}
          <div className="flex flex-col items-center bg-white p-1 rounded text-green-800">
            <Cancel />
            <span className="text-xs">Cancelled</span>
            <div className="w-full bg-green-300 h-0.5"></div>
            <span className="text-lg font-bold">0</span>
          </div>

          {/* Return Icon */}
          <div className="flex flex-col items-center bg-white p-1 rounded text-green-800">
            <ArrowBack />
            <span className="text-xs">Return</span>
            <div className="w-full bg-green-300 h-0.5"></div>
            <span className="text-lg font-bold">0</span>
          </div>

          {/* Review Icon */}
          <div className="flex flex-col items-center bg-white p-1 rounded text-green-800">
            <Star />
            <span className="text-xs">Review</span>
            <div className="w-full bg-green-300 h-0.5"></div>
            <span className="text-lg font-bold">0</span>
          </div>
        </div>
      </div>

      {/* Total Cash */}
      <div className="p-4 items-center justify-around bg-green-200 m-2 rounded text-green-900">
        <div className="text-left w-full bg-white shadow-md rounded-xl p-2 mb-2">
          <p variant="h6" className="font-bold">
            PHP 0.00
          </p>
          <p variant="caption">Total Cash</p>
        </div>

        {/* Cash Details */}
        <div className="grid grid-cols-4 md:grid-cols-4 gap-1">
          <div className="text-center bg-white shadow-md rounded-xl p-1">
            <p variant="caption">Cash on Hand</p>
            <p variant="caption" className="font-semibold">
              Php 0.00
            </p>
          </div>
          <div className="text-center bg-white shadow-md rounded-xl p-1">
            <p variant="caption">Gcash</p>
            <p variant="caption" className="font-semibold">
              Php 0.00
            </p>
          </div>
          <div className="text-center bg-white shadow-md rounded-xl p-1">
            <p variant="caption">Maya</p>
            <p variant="caption" className="font-semibold">
              Php 0.00
            </p>
          </div>
          <div className="text-center bg-white shadow-md rounded-xl p-1">
            <p variant="caption">Cash in Bank</p>
            <p variant="caption" className="font-semibold">
              Php 0.00
            </p>
          </div>
        </div>
      </div>

      {/* Add POS, Inbox, Purchases, and Reports Icons */}
      <div className="py-2 flex items-center justify-around rounded text-green-900">
        {/* POS Icon */}
        <Link to="/pos/home">
          <Button className="flex flex-col items-center rounded shadow-md bg-white w-1/4 p-2 m-2">
            <Store />
            <p variant="caption">POS</p>
          </Button>
        </Link>
        <div className="flex items-center rounded shadow-md bg-white w-3/4 p-2 justify-around m-2">
          <Link to="/partner/inbox" className="flex flex-col items-center">
              <Inbox />
              <p variant="caption">Inbox</p>
            </Link>
            <Link to="/pos/orders" className="flex flex-col items-center">
              <ShoppingCart />
              <p variant="caption">Orders</p>
            </Link>
            <Link to="/pos/reports" className="flex flex-col items-center">
              <InsertChart />
              <p variant="caption">Reports</p>
            </Link>
        </div>
      </div>
      
      {/* Add Date and Day Display */}
      <div className="flex justify-between items-center p-4 ">
        <p variant="h6" className="font-bold text-lg">
          Dashboard
        </p>

        <div className="flex items-center">
          <TextField type="date" id="datePicker" onChange={updateDate} className="border p-1 text-sm" />
          <div className="ml-4">
            <p variant="body2" id="dayToday" className="text-sm font-bold"></p>
          </div>
        </div>
      </div>

       {/* Sales Cards */}
       <div className="p-4 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Sales Card */}
        <div className="flex flex-col items-center bg-white p-4 rounded text-green-800 shadow-md">
          <span className="text-xs">Sales</span>
          <div className="w-full bg-green-300 h-0.5"></div>
          <span className="text-lg font-bold">₱ 0</span>
        </div>

        {/* Orders Delivered Card */}
        <div className="flex flex-col items-center bg-white p-4 rounded text-green-800 shadow-md">
          <span className="text-xs">Orders Delivered</span>
          <div className="w-full bg-green-300 h-0.5"></div>
          <span className="text-lg font-bold">0</span>
        </div>

        {/* Consumers Card */}
        <div className="flex flex-col items-center bg-white p-4 rounded text-green-800 shadow-md">
          <span className="text-xs">Consumers</span>
          <div className="w-full bg-green-300 h-0.5"></div>
          <span className="text-lg font-bold">0</span>
        </div>

        {/* Average Order Value Card */}
        <div className="flex flex-col items-center bg-white p-4 rounded text-green-800 shadow-md">
          <span className="text-xs">Average Order Value</span>
          <div className="w-full bg-green-300 h-0.5"></div>
          <span className="text-lg font-bold">₱ 0</span>
        </div>
      </div>

      
    </div>
  );
};

export default Home;
