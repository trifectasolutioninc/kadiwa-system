import React, { useEffect, useState } from "react";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import {
  Info,
  History,
  LocalShipping,
  Settings,
  Timer,
} from "@mui/icons-material";
import { Avatar, Badge } from "@mui/material";
import { Link, useNavigate} from "react-router-dom";
import firebaseDB from "../Configuration/config";
import { ref, child, get, getDatabase , update} from "firebase/database";
import redirectToIndexIfNoConnect from "../Scripts/connections/check";
import { FaBox } from "react-icons/fa";
import { IoWallet } from "react-icons/io5";
import { MdInsertLink } from "react-icons/md";
import BackButton from "./BackToHome";
import { AiFillCreditCard } from "react-icons/ai";
import { v4 as uuidv4 } from 'uuid';
const deviceDetect = require('device-detect')();

const ProfileConsumer = () => {
  const [userData, setUserData] = useState(null);
  const [userwalletData, setUserWalletData] = useState(null);
  const [userstoreData, setUserstoreData] = useState(null);
  const [version, setVersion] = useState("");

  const [pendingDeliveryCount, setPendingDeliveryCount] = useState(0);
  const [pendingPickupCount, setPendingPickupCount] = useState(0);
  const [deviceID, setDeviceID] = useState(null);
  const [deviceType, setDeviceType] = useState(null);
  const [deviceBrand, setDeviceBrand] = useState(null);
  const [deviceBrowser, setDeviceBrowser] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchVersion = async () => {
      try {
        const database = getDatabase();
        const versionRef = ref(database, "0_config_control/version");
        const snapshot = await get(versionRef);
        if (snapshot.exists()) {
          setVersion(snapshot.val());
        } else {
          console.log("No version found");
        }
      } catch (error) {
        console.error("Error getting version:", error);
      }
    };

    fetchVersion();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!redirectToIndexIfNoConnect()) {
        return;
      }

      const database = firebaseDB();
      const usersAccountRef = ref(database, "users_information");
      const usersWalletRef = ref(database, "user_wallet");
      const usersStoreRef = ref(database, "store_information");

      const ordersRef = ref(database, "orders_list");

      try {
        const uid = sessionStorage.getItem("uid");
        const snapshot = await get(ordersRef);

        if (snapshot.exists()) {
          let deliveryCount = 0;
          let pickupCount = 0;

          snapshot.forEach((order) => {
            const orderData = order.val();
            if (orderData.consumer === uid && orderData.status === "Pending") {
              if (orderData.shippingOption === "Delivery") {
                deliveryCount++;
              } else if (orderData.shippingOption === "Pickup") {
                pickupCount++;
              }
            }
          });

          setPendingDeliveryCount(deliveryCount);
          setPendingPickupCount(pickupCount);
        }
      } catch (error) {
        console.error("Error fetching user orders:", error);
      }

      try {
        const uid = sessionStorage.getItem("uid");
        const sid = sessionStorage.getItem("sid");
        const userSnapshot = await get(child(usersAccountRef, uid));
        const userwalletSnapshot = await get(child(usersWalletRef, uid));
        const userstoreSnapshot = await get(child(usersStoreRef, sid));

        if (
          (userSnapshot.exists() && userwalletSnapshot.exists()) ||
          userstoreSnapshot.exists()
        ) {
          const userData = userSnapshot.val();
          const userWalletData = userwalletSnapshot.val();
          const userstoreData = userstoreSnapshot.val();
          setUserData(userData);
          setUserWalletData(userWalletData);
          setUserstoreData(userstoreData);
          updateHTMLWithUserData(userData, userWalletData, userstoreData); // Call the function to update HTML
        } else {
          console.error("User not found");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const updateHTMLWithUserData = (
      userData,
      userWalletData,
      userstoreData
    ) => {
      if (!userData && !userstoreData && !userWalletData) {
        return;
      }

      const typeofuserElement = document.getElementById("typeofuser");
      const fullnameElement = document.getElementById("fullname");
      const contactElement = document.getElementById("contact");
      const balanceElement = document.getElementById("balance");
      const ptsElement = document.getElementById("points");
      const applyPartnerElement = document.getElementById("applyPartner");
      const storePartnerElement = document.getElementById("storePartner");
      const storeNameElement = document.getElementById("storeName");

      if (typeofuserElement) {
        typeofuserElement.textContent = userData.type || "No UserType";
      }

      if (storeNameElement) {
        storeNameElement.textContent = userstoreData.name || "No Store";
      }

      if (fullnameElement) {
        fullnameElement.textContent =
          userData.first_name + " " + userData.last_name || "No Name";
      }

      if (contactElement) {
        contactElement.textContent = userData.contact || "No Contact";
      }

      if (balanceElement) {
        balanceElement.textContent = `PHP ${userwalletData.balance}`;
      }

      if (ptsElement) {
        ptsElement.textContent = `KDW ${userwalletData.points}`;
      }

      if (applyPartnerElement && storePartnerElement) {
        console.log(userData.type);
        if (userData.type === "consumer") {
          applyPartnerElement.classList.remove("hidden");
          storePartnerElement.classList.add("hidden");
        } else if (userData.type === "partner") {
          applyPartnerElement.classList.add("hidden");
          storePartnerElement.classList.remove("hidden");
        }
      }
    };

    const fetchDataInterval = setInterval(() => {
      fetchUserData();
    }, 1000); // Fetch data every 5 seconds (adjust interval as needed)

    // Cleanup function to clear interval when component unmounts
    return () => {
      clearInterval(fetchDataInterval);
    };
  }, [userwalletData]);

  useEffect(() => {
    // Function to fetch or generate device ID
    const fetchDeviceID = () => {
      // Simulating fetching device ID (e.g., from localStorage)
      let id = localStorage.getItem('deviceID');
      console.log(id);
      if (!id) {
        id = uuidv4();
        localStorage.setItem('deviceID', id);
        console.log(id);
      }
      
      setDeviceID(id);
    };

    // Function to determine device type, brand, and browser
    const determineDeviceInfo = () => {
      setDeviceType(deviceDetect.device || 'Unknown');
      setDeviceBrand(deviceDetect.device || 'Unknown');
      setDeviceBrowser(deviceDetect.browser || 'Unknown');
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
      const uid = sessionStorage.getItem('uid');
      const authRef = ref(database, `authentication/${uid}/device/${deviceID}`);
    
      // Update device log to offline
      await update(authRef, {
        'log' : 'offline',
      });

      sessionStorage.setItem('uid', '');
     
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };


  return (
    <>
      <div className="fixed flex items-center gap-5 bg-white w-full top-0 p-3 right-0 left-0 z-10 shadow-md">
        <div>
          
        </div>
        <BackButton />
        <h1 className="text-xl text-green-600  font-bold">Profile</h1>
      </div>
      <main className="p-3 md:px-10 space-y-5 mt-14">
        <section className="p-2 border rounded-md bg-green-600">
          <div className="flex items-center justify-between text-white">
            <h1 className=" font-bold tracking-wider">Kadiwa App</h1>
            <p>Version: {version}</p>
          </div>
        </section>
        {/* Profile Information */}
        {userData ? (
          <section className="relative p-4 flex items-center justify-between border bg-white rounded-md shadow-md ">
            <div className="flex flex-col items-center gap-2">
              {/* Display Picture */}
              <Avatar className="w-12 h-12 rounded-full" />
              <div className="">
                {/* Display User Type */}
                <p
                  id="typeofuser"
                  className="w-fit text-center rounded-full px-2 py-1 text-xs text-black/80"
                  style={{ backgroundColor: "#54FC6F" }}
                >
                  {userData.type}
                </p>
              </div>
            </div>

            <div>
              <div className="text-black/80">
                {/* Display Name */}
                <h1 id="fullname" className="font-bold text-lg">
                  {userData.first_name + " " + userData.last_name}
                </h1>
                {/* Display Contact */}
                <p id="contact" className="text-black/80 font-semibold">
                  {userData.contact}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="">
                {/* Make the settings icon clickable */}
                <Link to="/route/profileinfo">
                  <Settings className="text-gray-500" />
                </Link>
              </div>
            </div>
          </section>
        ) : (

          <section className="relative p-4 flex items-center justify-between border bg-white rounded-md shadow-md ">
          <div className="flex flex-col items-center gap-2">
            {/* Display Picture */}
            <Avatar className="w-12 h-12 rounded-full" />
            <div className="">
              {/* Display User Type */}
              <p
                id="typeofuser"
                className="w-fit text-center rounded-full px-2 py-1 text-xs text-black/80"
                style={{ backgroundColor: "#54FC6F" }}
              >
                Consumer
              </p>
            </div>
          </div>

          <div>
            <div className="text-black/80">
              {/* Display Name */}
              <h1 id="fullname" className="font-bold text-lg">
                ......
              </h1>
              {/* Display Contact */}
              <p id="contact" className="text-black/80 font-semibold">
                ......
              </p>
            </div>
          </div>

          <div className="flex items-center">
            <div className="">
              {/* Make the settings icon clickable */}
              <Link to="/route/profileinfo">
                <Settings className="text-gray-500" />
              </Link>
            </div>
          </div>
        </section>


        )}

        {/* <div id="applyPartner" className="bg-green-300 mx-4 p-2 justify-between flex items-center rounded ">
        <span> Do you want to be Kadiwa Partner? Read more.</span>
        <Button className="bg-blue-500 p-1 text-white rounded">Apply</Button>
      </div>

      <div id="storePartner" className="bg-white mx-4 p-2 flex justify-between items-center rounded ">
        <div className='flex justify-center items-center'>
          <Store className=" text-gray-500"/>
          <span id='storeName' className="flex text-gray-700 font-bold">....</span>

        </div>
        
        <Link to="/partner/home" id="storeButton" className="bg-blue-500 py-1  text-white rounded ">Store</Link>
      </div> */}

        <div className=" flex justify-between">
          <h1 className="font-bold text-lg text-gray-800">My Wallet</h1>
          <div></div>
        </div>

        {userwalletData ? (
          <div className="p-4 flex justify-between bg-white border rounded-md shadow-md">
            {/* Display PHP Amount */}
            <p id="balance" className="text-gray-600 font-semibold mr-2">
              PHP {userwalletData.balance}
            </p>
            {/* Plus Icon Circle */}

            <Info className="bg-green-500 text-white p-1 rounded-full" />
          </div>
        ): (

          <div className="p-4 flex justify-between bg-white border rounded-md shadow-md">
          {/* Display PHP Amount */}
          <p id="balance" className="text-gray-600 font-semibold mr-2">
            PHP 0
          </p>
          {/* Plus Icon Circle */}

          <Info className="bg-green-500 text-white p-1 rounded-full" />
        </div>

        )}

        {userwalletData ? (
          <div className="p-4 flex justify-between bg-white border rounded-md shadow-md">
            {/* Display PHP Amount */}
            <p id="points" className="text-gray-600 font-semibold mr-2">
              KDW {userwalletData.points}
            </p>
            {/* Plus Icon Circle */}
            <Info className="bg-green-500 text-white p-1 rounded-full" />
          </div>
        ) : (
          <div className="p-4 flex justify-between bg-white border rounded-md shadow-md">
             {/* Display PHP Amount */}
             <p id="points" className="text-gray-600 font-semibold mr-2">
              KDW 0
            </p>
            {/* Plus Icon Circle */}
            <Info className="bg-green-500 text-white p-1 rounded-full" />
          </div>
        )}


        <section className="grid grid-cols-3 gap-3 md:gap-5 my-10">
          {/* Icon with Name: Virtual Card */}

          <Link
            to="/main/virtual-card"
            className="text-center flex flex-col items-center border rounded-md p-3 w-full bg-white shadow-md hover:bg-green-300"
          >
            <AiFillCreditCard className="text-3xl mx-auto text-blue-700 mb-2" />
            <p className="text-black/80 text-sm">Virtual Card</p>
          </Link>

          {/* Icon with Name: Linked Account */}

          <Link
            to="/main/linked-account"
            className="text-center flex flex-col items-center border rounded-md p-3 w-full bg-white shadow-md hover:bg-green-300"
          >
            <MdInsertLink className="text-3xl mx-auto text-yellow-500 mb-2" />
            <p className="text-black/80 text-sm">Linked Account</p>
          </Link>

          {/* Icon with Name: Transaction History */}

          <Link
            to={"/main/Wallet"}
            className="text-center flex flex-col items-center border rounded-md p-3 w-full bg-white shadow-md hover:bg-green-300"
          >
            <IoWallet className="text-3xl mx-auto text-green-700 mb-2" />
            <p className="text-black/80 text-sm ">Load</p>
          </Link>
        </section>

        <div className=" flex justify-between">
          <h1 className="font-bold text-lg text-gray-800">My Orders</h1>
          <div></div>
        </div>
        <section className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Link
            to={"/main/orders/delivery/pending"}
            className="relative px-4 py-2 bg-white rounded-md border-green-500 text-[0.8em] border shadow-md flex flex-col items-center justify-center gap-3"
          >
            <LocalShipping className="text-[1.2em] text-green-500" />
            Delivery
            {pendingDeliveryCount > 0 && (
              <Badge
                color="error"
                badgeContent={pendingDeliveryCount} // Display count in the badge
                style={{ position: "absolute", top: "-1px", right: "-1px" }} // Adjust Badge position
              />
            )}
          </Link>
          {/* Pickup Container */}
          <Link
            to={"/main/orders/pickup/pending"}
            className="relative px-4 py-2 bg-white rounded-md border-green-500 text-[0.8em] border shadow-md flex flex-col items-center justify-center gap-3"
          >
            <FaBox className="text-[1.2em] text-green-500" />
            Pickup
            {pendingPickupCount > 0 && (
              <Badge
                color="error"
                badgeContent={pendingPickupCount} // Display count in the badge
                style={{ position: "absolute", top: "-1px", right: "-1px" }} // Adjust Badge position
              />
            )}
          </Link>
          <Link
            to={"/main/orders/history/completed"}
            className="px-4 py-2 bg-white rounded-md border-green-500 text-[0.8em] border shadow-md flex flex-col items-center justify-center gap-3 whitespace-nowrap"
          >
            <History className=" text-green-500" />
            Transaction History
          </Link>
          <Link
            to={"/main/orders/history/completed"}
            className="px-4 py-2 bg-white rounded-md border-green-500 text-[0.8em] border shadow-md flex flex-col items-center justify-center gap-3 whitespace-nowrap"
          >
            <Timer className=" text-green-500" />
            Scheduled Delivery
          </Link>
        </section>
        <div className='flex items-center justify-end gap-3 w-full  bg-white p-2'>
        <button
          onClick={handleLogout}
          className="flex items-center justify-center mx-auto text-white bg-red-500 w-full rounded-md p-2"
        >
          Logout
          <ExitToAppIcon />
        </button>
      </div>
        <div className="p-2 h-32"></div>
      </main>
    </>
  );
};

export default ProfileConsumer;
