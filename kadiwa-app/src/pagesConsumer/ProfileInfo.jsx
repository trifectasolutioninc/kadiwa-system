import React, { useEffect, useState } from 'react';
import { Avatar} from '@mui/material';
// import NotificationsIcon from '@mui/icons-material/Notifications';
import EditIcon from '@mui/icons-material/Edit';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import firebaseDB from '../Configuration/config';
import { ref, child, get, update } from 'firebase/database';
import { NavLink, Link  } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";
import EditAddress from './Profile/EditAddress';
import AddAddressModal from './Profile/AddAddress';


const MaxAddressWarningModal = ({ showModal, closeModal }) => {
  return (
    showModal && (
      <div className="fixed inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white rounded-md p-8 max-w-sm">
          <h2 className="text-lg font-bold mb-4">Maximum Address Limit Reached</h2>
          <p className="text-gray-700">You can only add up to 3 additional addresses.</p>
          <button onClick={closeModal} className="mt-4 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300">OK</button>
        </div>
      </div>
    )
  );
};

const ProfileInfo = () => {

  const [userData, setUserData] = useState({
    usertype: '',
    info_status: '',
    fullname: 'No Name',
    contact: 'No Contact',
    email: 'No Email',
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
        const uid = sessionStorage.getItem('uid');
        const usersAccountRef = ref(database, 'users_information');
        const addressesRef = ref(database, 'users_address');

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
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
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
      const uid = sessionStorage.getItem('uid');
      const addressesRef = ref(database, 'users_address');
  
      // Update additional addresses in Firebase
      await update(child(addressesRef, uid), {
        additional: [...(userAddresses.additional || []), newAddress],
      });
  
      // Update state
      setUserAddresses((prevState) => ({
        ...prevState,
        additionalAddresses: [...(prevState.additionalAddresses || []), newAddress],
      }));
    } catch (error) {
      console.error('Error adding address:', error);
    }
  };
  

  const closeModal = () => {
    setIsEditAddressOpen(false);
    setIsAddAddressModalOpen(false);
  };

  return (
    <div className=' bg-gray-100 h-screen'>
      
      <div className='px-4'>
        <div className='flex pt-4 mb-1 items-center  space-x-1'>
          <div>
            
          </div>
          <div className='flex'>
          <NavLink to={"/main/profile"} className=''>
            <IoMdArrowRoundBack />
          </NavLink>

          </div>
  
          
          <h1 className="text-lg text-green-600 font-bold">Profile</h1>
        </div>
        {/* Profile Information */}
        <div className="relative p-4 flex justify-between items-center bg-white rounded-md shadow-md">
          <div>
            {/* Display Picture */}
            <Avatar id="profileImg" alt="Profile Picture" className="w-12 h-12 rounded-full" />
          </div>
          <div className="ml-4 mt-2">
            {/* Display Name */}
            <p id="fullname" variant="h6" className="font-bold">
              {userData.first_name + " " + userData.last_name}
            </p>
            {/* Display Contact */}
            <p
              id="infostatus"
              variant="body2"
              className="text-gray-400 text-xs bg-gray-200 rounded-3xl text-center"
            >
              {userData.info_status}
            </p>
          </div>
          <div className="flex items-center">
            <div className="absolute top-0 right-0 p-2">
              {/* Display User Type */}
              <p
                id="typeofuser"
                variant="body2"
                className="rounded-3xl p-1 text-xs text-gray-800"
                style={{ backgroundColor: '#54FC6F' }}
              >
                {userData.type}
              </p>
            </div>
            {/* Make the edit icon clickable */}
            <Link to="/route/profileedit">
              <div className="ml-2 mt-4">
                <EditIcon className="text-gray-500" />
              </div>
            </Link>
          </div>
        </div>

        <div className=" py-2 text-[0.8em] ">
          <p variant="body2" className="font-bold text-gray-500">
            Email (Optional):
            <span id="email" className="ml-2 font-normal">
              {userData.email}
            </span>
          </p>
          <p
            variant="body2"
            className="font-bold text-gray-500 mb-2"
          >
            Contact:
            <span id="contact" className="ml-2 font-normal">
              {userData.contact}
            </span>
          </p>
        </div>

        <div>
          <hr />
          <h1 className='font-bold text-gray-800 mb-2'>Delivery Information</h1>

          {/* Display default address */}
          {userAddresses.default && (
            <div className='bg-white rounded-md shadow-lg mb-4'>
              <div className="px-1 flex justify-between ">
                <p variant="body2" className="text-sm text-gray-600">
                  Default Address
                </p>
                <div>
                  <button onClick={() => handleEditAddressToggle("default")} className="text-sm px-2 font-bold text-green-700 cursor-pointer">Edit</button>
                </div>
              </div>
              <hr className=' mx-1' />

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
                  <LocationOnIcon className="text-gray-500" />
                  {userAddresses.default.barangay}, {userAddresses.default.city}
                </p>
              </div>
            </div>
          )}

          {/* Display additional addresses */}
          <div className="px-1 flex justify-between bg-white rounded-t-md ">
            <p variant="body2" className="text-sm text-gray-600">
              Additional Address
            </p>
            <div>
              <button
                onClick={() => setIsAddAddressModalOpen(true)} // Open modal when Add button is clicked
                className="text-sm px-2 font-bold text-green-700"
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
          {userAddresses.additional && userAddresses.additional.map((address, index) => (
            <div key={index} className='bg-white shadow-lg'>

              <hr className=' mx-1' />

              <div className="p-4">
                <div className=' text-right'>
                  <button onClick={() => handleEditAddressToggle(`additional/${index}`)} className=" text-sm text-right font-bold text-green-700 cursor-pointer">Edit</button>

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
        <div className='h-16 p-2'></div>
      </div>
      
      {isEditAddressOpen && <EditAddress addressType={editAddressType} closeModal={closeModal} />}
      <MaxAddressWarningModal showModal={isMaxAddressReached} closeModal={() => setIsMaxAddressReached(false)} />
    </div>
  );
};

export default ProfileInfo;
