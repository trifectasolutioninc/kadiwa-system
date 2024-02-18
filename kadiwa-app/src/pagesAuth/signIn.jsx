import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import configFirebaseDB from '../Configuration/config';
import { getDatabase, ref, get, set } from 'firebase/database';
import InputMask from 'react-input-mask';
import { imageConfig } from '../Configuration/config-file';
import { v4 as uuidv4 } from 'uuid';
const deviceDetect = require('device-detect')();

const SignInPages = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [version, setVersion] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();
  const phoneNumberRef = useRef(null);
  const passwordRef = useRef(null);

  const [deviceID, setDeviceID] = useState(null);
  const [deviceType, setDeviceType] = useState(null);
  const [deviceBrand, setDeviceBrand] = useState(null);
  const [deviceBrowser, setDeviceBrowser] = useState(null);

  useEffect(() => {
      const fetchVersion = async () => {
          try {
              const database = getDatabase();
              const versionRef = ref(database, '0_config_control/version');
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


  const handleSignIn = async (event) => {
    event.preventDefault();
  
    try {
      const db = configFirebaseDB();
      const usersRef = ref(db, 'authentication');
      const snapshot = await get(usersRef);
  
      if (snapshot.exists()) {
        let success = false;
        snapshot.forEach((childSnapshot) => {
          const userData = childSnapshot.val();
  
          const inputUsername = phoneNumberRef.current.value;
          const inputPassword = passwordRef.current.value;
          const inputUsername2 = inputUsername.replace(/\s/g, '');
  
          if (
            (userData.username === inputUsername ||
              userData.contact === inputUsername || userData.contact === inputUsername2.replace(/x/g, "+63") ||
              userData.email === inputUsername) &&
            userData.password === inputPassword
          ) {
            // Update session storage
            sessionStorage.setItem('log', 'online');
            sessionStorage.setItem('uid', userData.id);
            sessionStorage.setItem('sid', userData.store_id);
            console.log('Successfully logged in', userData);
            success = true;
  
            // Check if the user has devices
            if (userData.device && userData.device.length > 0) {
              let deviceExists = false;
              // Iterate over each device
              userData.device.forEach((device, index) => {
                if (device.id === deviceID) {
                  // Update the status of the device to "online"
                  const deviceRef = ref(db, `authentication/${userData.id}/device/${index}/log`);
                  set(deviceRef, 'online').then(() => {
                    console.log('Device status updated to online');
                  }).catch((error) => {
                    console.error('Error updating device status:', error);
                  });
                  deviceExists = true;
                }
              });
              if (!deviceExists) {
                // If the deviceID is not found in the user's devices, add the new device
                const newDevice = {
                  id: deviceID,
                  type: deviceType,
                  brand: deviceBrand,
                  browser: deviceBrowser,
                  log: 'online'
                };
                const deviceRef = ref(db, `authentication/${userData.id}/device`);
                set(deviceRef.push(), newDevice).then(() => {
                  console.log('New device added');
                }).catch((error) => {
                  console.error('Error adding new device:', error);
                });
              }
            } else {
              // If the user has no devices, add the new device
              const newDevice = {
                id: deviceID,
                type: deviceType,
                brand: deviceBrand,
                browser: deviceBrowser,
                log: 'online'
              };
              const deviceRef = ref(db, `authentication/${userData.id}/device`);
              set(deviceRef.push(), newDevice).then(() => {
                console.log('New device added');
              }).catch((error) => {
                console.error('Error adding new device:', error);
              });
            }
          }
        });
  
        if (success) {
          setModalMessage('Login successful!');
        } else {
          setModalMessage('Incorrect username or password.');
        }
        setShowModal(true);
      } else {
        console.error('No users found');
      }
    } catch (error) {
      console.error('Error logging in:', error.message);
    }
  };
  
  
  const closeModal = () => {
    setShowModal(false);
    if (modalMessage === 'Login successful!') {
      navigate('/main');
    }
  };

  return (
    <div className=' bg-white flex items-center justify-center h-screen'>
      <div className=''>
      <div className='flex justify-center mx-auto w-auto space-x-2'>
                  <img className=" h-[5em] " src={imageConfig.DALogo} alt="Farm Logo" />
                  <img className=" h-[5em] " src={imageConfig.AppLogo} alt="Farm Logo" />
                  <img className=" h-[5em] " src={imageConfig.BGPH} alt="Farm Logo" />

                  </div>

        <div className="mt-5 p-8 rounded">
          <form id="loginForm" className="space-y-1" onSubmit={handleSignIn}>
            <div className="text-left">
              <label htmlFor="contact" className="text-sm text-gray-500">
                Phone Number
              </label>
              <InputMask
                id="phoneNumber"
                name="phoneNumber"
                mask="+63 999 999 9999"
                autoComplete="tel"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="+63 9XX XXX XXXX"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                ref={phoneNumberRef} // Attach ref to phone number input
              />
            </div>

            <div className="text-left">
              <label htmlFor="password" className="text-sm text-gray-500">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                ref={passwordRef} // Attach ref to password input
              />
            </div>

            <div className="items-center justify-center text-center">
              
              <button
                type="submit"
                className="w-full py-2 mt-4 bg-green-600 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:border-green-300"
              >
                Login
              </button>
            </div>
          </form>
 
          <div className="mt-4 text-gray-700 text-center">
                <NavLink to="#" className="text-sm text-green-600">
                  Forgot Password?
                </NavLink>
            <p className="text-gray-500">
              Don't have an account?{' '}
              <NavLink to="/" className="text-green-600 font-semibold">
                Register
              </NavLink>
            </p>
          </div>
        </div>
        <div className='flex items-end text-center py-4 text-xs text-gray-600  bg-white'>
        <p className='mx-auto mt-auto '>{version}</p>
      </div>

      </div>

      {/* Modal for displaying login status */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 z-50 bg-opacity-50">
          <div className="bg-white p-4 rounded-md w-64 text-center">
            <p className="text-lg font-semibold">{modalMessage}</p>
            <button onClick={closeModal} className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md focus:outline-none hover:bg-green-700">Close</button>
          </div>
        </div>
      )}

     

    </div>
  );
};

export default SignInPages;
