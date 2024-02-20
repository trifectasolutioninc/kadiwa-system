import React, { useState, useEffect } from 'react';

import { IoMdArrowRoundBack } from 'react-icons/io';
import { NavLink } from 'react-router-dom';
const PersonalInfoPage = () => {
  return (
    <div className=' bg-gray-100 h-screen'> 
        <div>
        <div className="bg-white pb-2 shadow-md top-0 fixed w-full">
      <div className="flex items-center gap-5 p-3">
            <NavLink to={"/route/profileedit"} className="">
              <IoMdArrowRoundBack fontSize={"25px"} />
            </NavLink>
            <h1 className="text-lg text-green-600 font-bold">
              Edit Profile
            </h1>
          </div></div>

        </div>
        
        
    </div>
  )
}

export default PersonalInfoPage;
