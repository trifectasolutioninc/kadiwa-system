import React, { useState, useEffect } from 'react';

import { IoMdArrowRoundBack } from 'react-icons/io';
import { NavLink } from 'react-router-dom';
import { RiAccountCircleFill } from "react-icons/ri";
import { IoIosSettings } from "react-icons/io";
import { MdContactSupport } from "react-icons/md";
import { MdPermIdentity } from "react-icons/md";

const ProfileEdit = () => {
   
  return (
    <div className=' h-screen bg-gray-100'>
      <div className=' '>
      {/* Header */}
      <div className="bg-white pb-2 shadow-md top-0 fixed w-full">
      <div className="flex items-center gap-5 p-3">
            <NavLink to={"/main/profile"} className="">
              <IoMdArrowRoundBack fontSize={"25px"} />
            </NavLink>
            <h1 className="text-lg text-green-600 font-bold">
              Account Management
            </h1>
          </div></div>
      <div className='h-16'></div>
      <div className='px-4 text-[0.8em] py-1 text-gray-700 flex items-center gap-2'>
        <div>
          <RiAccountCircleFill />
        </div>
        My Account
      </div>
      <div className=' w-full p-4 bg-white'>
        <div className=' py-2 '>
          <NavLink to={"/route/personal-info"} className=''>Personal Information</NavLink>
        </div>
        <hr />
        <div className=' py-2 '>
          <NavLink to={"/route/myaddresses"} className=''>My Addresses</NavLink>
        </div>
        <hr />
        <div className=' py-2 '>
          <button className=' '>Account and Security</button>
        </div>
        
        
      </div>
      <div className='px-4 text-[0.8em] py-1 text-gray-700 flex items-center gap-2'>
      <div>
          <IoIosSettings />
        </div>
        Settings
      </div>
      <div className=' w-full p-4 bg-white '>
        <div className=' '>
          <button className='py-2'>Language/Wika</button>
        </div>   
      </div>
      <div className='px-4 text-[0.8em] py-1 text-gray-700 flex items-center gap-2'>
      <div>
          <MdContactSupport />
        </div>
        Support
      </div>
      <div className=' w-full p-4 bg-white '>
        <div className=' '>
          <button className='py-2'>Help Centre</button>
        </div> 
        <hr />
        <div className=' py-2 '>
          <button className=' '>Kadiwa Policies</button>
        </div>  
        <hr />
        <div className=' py-2 '>
          <button className=' '>About</button>
        </div>  
        <hr />
        <div className=' py-2 '>
          <button className=' '>Request Account Deletion</button>
        </div>  
      </div>
     

    </div>


    </div>
    
  );
};

export default ProfileEdit;
