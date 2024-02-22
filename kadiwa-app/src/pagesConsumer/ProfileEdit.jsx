import React, { useState, useEffect } from "react";

import { IoMdArrowRoundBack } from "react-icons/io";
import { NavLink } from "react-router-dom";
import { RiAccountCircleFill } from "react-icons/ri";
import { IoIosSettings } from "react-icons/io";
import { MdContactSupport } from "react-icons/md";
import { MdPermIdentity } from "react-icons/md";
import { IoIosArrowForward } from "react-icons/io";

const ProfileEdit = () => {
  return (
    <>
      {/* Header */}
      <div className="bg-green-700 shadow-md top-0 fixed w-full">
        <div className="flex items-center gap-5 p-3">
          <NavLink to={"/main/profile"} className="">
            <IoMdArrowRoundBack fontSize={"25px"} />
          </NavLink>
          <h1 className="text-lg text-neutral-100 font-bold">
            Account Management
          </h1>
        </div>
      </div>
      <section className="mt-16 space-y-3">
        <div className="px-4 text-sm py-1 text-gray-700 flex items-center gap-2">
          <RiAccountCircleFill fontSize={"25px"} />
          My Account
        </div>
        <div className=" w-full p-3 bg-white space-y-2">
          <NavLink
            to={"/route/personal-info"}
            className=" w-full p-2 flex items-center justify-between text-black/80"
          >
            Personal Information
            <IoIosArrowForward />
          </NavLink>
          <hr />
          <NavLink
            to={""}
            className=" w-full p-2 flex items-center justify-between text-black/80"
          >
            Account and Security
            <IoIosArrowForward />
          </NavLink>
        </div>
        <div className="px-4 text-sm py-1 text-gray-700 flex items-center gap-2">
          <IoIosSettings fontSize={"25px"} />
          Settings
        </div>
        <div className=" w-full p-4 bg-white space-y-2 ">
          <NavLink
            to={""}
            className=" w-full p-2 flex items-center justify-between text-black/80"
          >
            Language
            <IoIosArrowForward />
          </NavLink>
        </div>
        <div className="px-4 text-sm py-1 text-gray-700 flex items-center gap-2">
          <MdContactSupport fontSize={"25px"} />
          Support
        </div>
        <div className=" w-full p-4 bg-white space-y-2 ">
          <NavLink
            to={""}
            className=" w-full p-2 flex items-center justify-between text-black/80"
          >
            Help Center
            <IoIosArrowForward />
          </NavLink>
          <hr />
          <NavLink
            to={""}
            className=" w-full p-2 flex items-center justify-between text-black/80"
          >
            Kadiwa Policies
            <IoIosArrowForward />
          </NavLink>
          <hr />
          <NavLink
            to={""}
            className=" w-full p-2 flex items-center justify-between text-black/80"
          >
            About
            <IoIosArrowForward />
          </NavLink>
          <hr />
          <NavLink
            to={""}
            className=" w-full p-2 flex items-center justify-between text-black/80"
          >
            Request Account Deletion
            <IoIosArrowForward />
          </NavLink>
        </div>
      </section>
    </>
  );
};

export default ProfileEdit;
