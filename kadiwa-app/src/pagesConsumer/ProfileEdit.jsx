import React, { useState, useEffect } from "react";

import { IoMdArrowRoundBack } from "react-icons/io";
import { NavLink, useNavigate } from "react-router-dom";
import { RiAccountCircleFill } from "react-icons/ri";
import { IoIosSettings } from "react-icons/io";
import { MdContactSupport } from "react-icons/md";
import { MdPermIdentity } from "react-icons/md";
import { IoIosArrowForward } from "react-icons/io";
import Toast from "./../Components/Notifications/Toast";
import firebaseDB from "../Configuration/config";
import { ref, child, get, getDatabase, update } from "firebase/database";
import { v4 as uuidv4 } from "uuid";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { Logout } from "../services/user/auth.service";

const ProfileEdit = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleToast = async () => {
    setToastMessage("Coming Soon... ");
    setShowToast(true);
  };
  const deviceDetect = require("device-detect")();
  const [deviceID, setDeviceID] = useState(null);
  const [deviceType, setDeviceType] = useState(null);
  const [deviceBrand, setDeviceBrand] = useState(null);
  const [deviceBrowser, setDeviceBrowser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Function to fetch or generate device ID
    const fetchDeviceID = () => {
      // Simulating fetching device ID (e.g., from localStorage)
      let id = localStorage.getItem("deviceID");
      console.log(id);
      if (!id) {
        id = uuidv4();
        localStorage.setItem("deviceID", id);
        console.log(id);
      }

      setDeviceID(id);
    };

    // Function to determine device type, brand, and browser
    const determineDeviceInfo = () => {
      setDeviceType(deviceDetect.device || "Unknown");
      setDeviceBrand(deviceDetect.device || "Unknown");
      setDeviceBrowser(deviceDetect.browser || "Unknown");
    };

    fetchDeviceID();
    determineDeviceInfo();

    // Cleanup function if needed
    return () => {
      // Any cleanup code
    };
  }, []);

  const handleLogout = async () => {
    try {
      const database = firebaseDB();
      const uid = sessionStorage.getItem("uid");
      const authRef = ref(database, `authentication/${uid}/device/${deviceID}`);

      // Update device log to offline
      await update(authRef, {
        log: "offline",
      });

      sessionStorage.setItem("uid", "");
      Logout();
      navigate("/");

      // Log out other users with the same deviceID
      const usersRef = ref(database, "authentication");
      const usersSnapshot = await get(usersRef);

      for (const user of usersSnapshot.val()) {
        const userId = user.key;
        if (userId !== uid) {
          // Skip current user
          const userDevicesRef = ref(
            database,
            `authentication/${userId}/device`
          );
          const userDevicesSnapshot = await get(userDevicesRef);

          for (const device of userDevicesSnapshot.val()) {
            if (device.deviceID === deviceID) {
              // Update device log to offline
              update(
                ref(database, `authentication/${userId}/device/${device.id}`),
                {
                  log: "offline",
                }
              );
            }
          }
        }
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  const openLogoutModal = () => {
    setIsOpen(true);
  };

  const closeLogoutModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Header */}
      <div className="bg-green-700 shadow-md top-0 fixed w-full">
        <div className="flex items-center gap-5 p-3">
          <NavLink to={"/main/profile"} className="">
            <IoMdArrowRoundBack
              fontSize={"25px"}
              className="text-neutral-100"
            />
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
            to={"/route/myaddresses"}
            className=" w-full p-2 flex items-center justify-between text-black/80"
          >
            My Address
            <IoIosArrowForward />
          </NavLink>
          <hr />
          <NavLink
            to={""}
            onClick={handleToast}
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
            onClick={handleToast}
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
            onClick={handleToast}
            className=" w-full p-2 flex items-center justify-between text-black/80"
          >
            Help Center
            <IoIosArrowForward />
          </NavLink>
          <hr />
          <NavLink
            to={""}
            onClick={handleToast}
            className=" w-full p-2 flex items-center justify-between text-black/80"
          >
            Kadiwa Policies
            <IoIosArrowForward />
          </NavLink>
          <hr />
          <NavLink
            to={""}
            onClick={handleToast}
            className=" w-full p-2 flex items-center justify-between text-black/80"
          >
            About
            <IoIosArrowForward />
          </NavLink>
          <hr />
          <NavLink
            to={""}
            onClick={handleToast}
            className=" w-full p-2 flex items-center justify-between text-black/80"
          >
            Request Account Deletion
            <IoIosArrowForward />
          </NavLink>
        </div>
        <div className="flex items-center justify-end gap-3 w-full p-2 fixed bottom-0">
          <button
            onClick={openLogoutModal}
            className="flex items-center justify-center mx-auto text-black/80 bg-white border w-full rounded-md shadow-sm p-2"
          >
            Logout
            <ExitToAppIcon />
          </button>
        </div>
      </section>
      {isOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex  justify-center items-center"
          onClick={closeLogoutModal}
        >
          <div className="bg-white  w-3/4 p-4 rounded-md shadow-md space-y-3">
            <h1 className="font-bold">Confirm Logout</h1>
            <hr />
            <p>Are you sure you want to logout?</p>
            <div className="flex justify-end gap-3">
              <button
                className="px-3 py-2  rounded-md text-black/80"
                onClick={closeLogoutModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md mr-2"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
      {showToast && (
        <Toast message={toastMessage} onClose={() => setShowToast(false)} />
      )}
      {showToast && (
        <Toast message={toastMessage} onClose={() => setShowToast(false)} />
      )}
    </>
  );
};

export default ProfileEdit;
