import React, { useEffect, useState } from "react";
import { Avatar } from "@mui/material";
// import NotificationsIcon from '@mui/icons-material/Notifications';
import EditIcon from "@mui/icons-material/Edit";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import firebaseDB from "../../../Configuration/config";
import { ref, child, get, update, onValue, off, push } from "firebase/database";
import { NavLink, Link } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import EditAddress from "../EditAddress";
import AddAddressModal from "../AddAddress";

const MaxAddressWarningModal = ({ showModal, closeModal }) => {
  return (
    showModal && (
      <div className="fixed inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white rounded-md p-8 max-w-sm">
          <h2 className="text-lg font-bold mb-4">
            Maximum Address Limit Reached
          </h2>
          <p className="text-gray-700">
            You can only add up to 3 additional addresses.
          </p>
          <button
            onClick={closeModal}
            className="mt-4 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300"
          >
            OK
          </button>
        </div>
      </div>
    )
  );
};

const MyAddresses = () => {
  const [userData, setUserData] = useState({
    usertype: "",
    info_status: "",
    fullname: "No Name",
    contact: "No Contact",
    email: "No Email",
  });
  const [userAddresses, setUserAddresses] = useState({
    defaultAddress: null,
    additionalAddresses: [],
  });
  const [isEditAddressOpen, setIsEditAddressOpen] = useState(false);
  const [editAddressType, setEditAddressType] = useState(null);
  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false); // State for Add Address modal

  useEffect(() => {
    const fetchData = async () => {
      try {
        const database = firebaseDB();
        const uid = sessionStorage.getItem("uid");
        const usersAccountRef = ref(database, "users_information");
        const addressesRef = ref(database, "users_address");

        // Fetch user account data
        const snapshot = await get(child(usersAccountRef, uid));
        const userDataFromFirebase = snapshot.val();

        if (userDataFromFirebase) {
          setUserData(userDataFromFirebase);
        }

        // Fetch user addresses
        const addressSnapshot = await get(child(addressesRef, uid));
        const userAddressesFromFirebase = addressSnapshot.val();

        if (userAddressesFromFirebase) {
          setUserAddresses(userAddressesFromFirebase);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    // Add event listener for changes in user addresses
    const database = firebaseDB();
    const uid = sessionStorage.getItem("uid");
    const addressesRef = ref(database, "users_address/" + uid);
    const handleDataChange = (snapshot) => {
      const userAddressesFromFirebase = snapshot.val();
      if (userAddressesFromFirebase) {
        setUserAddresses(userAddressesFromFirebase);
      }
    };

    onValue(addressesRef, handleDataChange);

    // Clean up the event listener
    return () => off(addressesRef, handleDataChange);
  }, []);

  const handleEditAddressToggle = (addressType) => {
    setEditAddressType(addressType);
    setIsEditAddressOpen(!isEditAddressOpen);
  };

  const [isMaxAddressReached, setIsMaxAddressReached] = useState(false);

  const handleAddAddress = async (newAddress) => {
    try {
      if (userAddresses.additional.length >= 3) {
        setIsMaxAddressReached(true); // Show modal warning
        return; // Stop further execution
      }

      const database = firebaseDB();
      const uid = sessionStorage.getItem("uid");
      const addressesRef = ref(
        database,
        "users_address/" + uid + "/additional"
      );

      // Push new address to Firebase
      await push(addressesRef, newAddress);

      // No need to manually update state here, useEffect will automatically update it when data changes in the database
    } catch (error) {
      console.error("Error adding address:", error);
    }
  };

  const closeModal = () => {
    setIsEditAddressOpen(false);
    setIsAddAddressModalOpen(false);
  };

  return (
    <div className="p-3 md:px-10 mb-28">
      <div className="fixed flex items-center gap-5 bg-green-700 w-full top-0 p-3 right-0 left-0">
        <NavLink to={"/route/profileedit/"}>
          <IoMdArrowRoundBack fontSize={"25px"} className="text-neutral-100" />
        </NavLink>
        <h1 className="text-xl font-bold  text-neutral-100">My Address</h1>
      </div>

      <div className="mt-14 space-y-5">
        <h1 className="font-bold text-black/80">Delivery Information</h1>

        {/* Display default address */}
        {userAddresses.default && (
          <div className="bg-white rounded-md shadow-lg mb-4">
            <div className="p-2 flex justify-between items-center">
              <p variant="body2" className="text-black/80">
                Default Address
              </p>
              <div>
                <button
                  onClick={() => handleEditAddressToggle("default")}
                  className=" p-2 font-bold text-green-700 cursor-pointer"
                >
                  Edit
                </button>
              </div>
            </div>
            <hr className=" mx-1" />

            <div className="p-4 bg-white rounded-b-md shadow-md">
              <div className="flex justify-between w-full">
                <p variant="body1" className="text-gray-700 flex-grow">
                  {userAddresses.default.person}
                </p>
                <p variant="body1" className="text-gray-700">
                  {userAddresses.default.contact}
                </p>
              </div>
              <p variant="body1" className="text-gray-800 flex font-semibold">
                <LocationOnIcon className="text-green-600" />
                {userAddresses.default.barangay}, {userAddresses.default.city}
              </p>
            </div>
          </div>
        )}

        {/* Display additional addresses */}
        <div className="p-2 flex justify-between items-center bg-white rounded-md shadow-md ">
          <p variant="body2" className=" text-black/80">
            Additional Address
          </p>
          <div>
            <button
              onClick={() => setIsAddAddressModalOpen(true)} // Open modal when Add button is clicked
              className="p-2 font-bold text-green-700"
            >
              Add
            </button>
            <AddAddressModal
              showModal={isAddAddressModalOpen}
              closeModal={closeModal}
              handleAddAddress={handleAddAddress}
            />
          </div>
        </div>
        {userAddresses.additional &&
          userAddresses.additional.map((address, index) => (
            <div key={index} className="bg-white shadow-lg">
              <hr className=" mx-1" />

              <div className="p-4">
                <div className=" text-right">
                  <button
                    onClick={() =>
                      handleEditAddressToggle(`additional/${index}`)
                    }
                    className=" text-sm text-right font-bold text-green-700 cursor-pointer"
                  >
                    Edit
                  </button>
                </div>

                <div className="flex justify-between w-full">
                  <p variant="body1" className="text-gray-700 flex-grow">
                    {address.person}
                  </p>
                  <p variant="body1" className="text-gray-700">
                    {address.contact}
                  </p>
                </div>
                <p variant="body1" className="text-gray-800 flex font-semibold">
                  <LocationOnIcon className="text-gray-500" />
                  {address.barangay}, {address.city}
                </p>
              </div>
            </div>
          ))}
      </div>
      <div className="h-16 p-2"></div>

      {isEditAddressOpen && (
        <EditAddress addressType={editAddressType} closeModal={closeModal} />
      )}
      <MaxAddressWarningModal
        showModal={isMaxAddressReached}
        closeModal={() => setIsMaxAddressReached(false)}
      />
    </div>
  );
};

export default MyAddresses;
