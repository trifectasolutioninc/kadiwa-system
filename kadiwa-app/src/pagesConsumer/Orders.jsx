import React, { useEffect, useState, useRef } from 'react';
import { useParams, NavLink } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";
import { MdLocalShipping } from "react-icons/md";
import { FaJoget } from "react-icons/fa";
import { FaBoxOpen } from "react-icons/fa";
import { FaBox } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { FiMinusCircle } from "react-icons/fi";

const Orders = () => {
  const { tab } = useParams();

  return (
  
  <div className='h-screen'>
   <div className=' bg-gray-100 h-full'>
        <div className=' bg-white pb-2 shadow-md'>
        <div className='flex pt-4 mb-1 items-center px-4  space-x-1'>
            <NavLink to={"/main/profile"} className=''>
            <IoMdArrowRoundBack />
            </NavLink>
            <h1 className="text-lg text-green-600  font-bold">{tab.toUpperCase()}</h1>
        </div>
        <hr  className='mx-4 pb-2'/>
        {tab === 'delivery' && (
            <div className='flex space-x-4 overflow-x-auto mx-6'>
            <button className='text-[0.8em] whitespace-nowrap text-gray-800'><MdLocalShipping className=' mx-auto'/>To Ship </button>
            <button className='text-[0.8em] whitespace-nowrap text-gray-800'><FaJoget className=' mx-auto'/>To Receive</button>
            <button className='text-[0.8em] whitespace-nowrap text-gray-800'><FaCheckCircle className=' mx-auto'/>Completed</button>
            <button className='text-[0.8em] whitespace-nowrap text-gray-800'><FiMinusCircle className=' mx-auto'/>Cancelled</button>
            </div>
        )}
        {tab === 'pickup' && (
            <div className='flex space-x-4 overflow-x-auto mx-6'>
            <button className='text-[0.8em] whitespace-nowrap text-gray-800'><FaBoxOpen className=' mx-auto' /><span>To Pack</span></button>
            <button className='text-[0.8em] whitespace-nowrap text-gray-800'><FaBox className=' mx-auto'/>To Distribute</button>
            <button className='text-[0.8em] whitespace-nowrap text-gray-800'><FaCheckCircle className=' mx-auto'/>Completed</button>
            <button className='text-[0.8em] whitespace-nowrap text-gray-800'><FiMinusCircle className=' mx-auto'/>Cancelled</button>
            </div>
        )}

        </div>
     
    </div>
  </div>
   
  );
};

export default Orders;
