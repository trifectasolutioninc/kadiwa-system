import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getDatabase, ref, get, set } from "firebase/database";
import InputMask from "react-input-mask";
import { imageConfig } from "../../Configuration/config-file";
import { v4 as uuidv4 } from "uuid";
import Toast from "../../Components/Notifications/Toast";
import AppUpdateModal from "./../../Components/modals/AppUpdateModal";
import { BRAND } from "../../services/configurations/application.config";

const deviceDetect = require("device-detect")();

const SignInPages = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [version, setVersion] = useState("");
  const [appversion, setAppVersion] = useState("");

  const navigate = useNavigate();
  const phoneNumberRef = useRef(null);
  const passwordRef = useRef(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [deviceID, setDeviceID] = useState(null);
  const [deviceType, setDeviceType] = useState(null);
  const [deviceBrand, setDeviceBrand] = useState(null);
  const [deviceBrowser, setDeviceBrowser] = useState(null);

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        const database = getDatabase();
        const versionRef = ref(database, "0_config_control/version");
        const snapshot = await get(versionRef);
        if (snapshot.exists()) {
          setVersion(snapshot.val());
          setAppVersion(BRAND.version);
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

  const handleSignIn = async (event) => {
    event.preventDefault();

    try {
      const database = getDatabase(); // get database directly
      const usersRef = ref(database, "authentication");
      const snapshot = await get(usersRef);

      if (snapshot.exists()) {
        let success = false;
        snapshot.forEach((childSnapshot) => {
          const userData = childSnapshot.val();

          const inputUsername = phoneNumberRef.current.value;
          const inputPassword = passwordRef.current.value;
          const inputUsername2 = inputUsername.replace(/\s/g, "");

          if (
            (userData.username === inputUsername ||
              userData.contact === inputUsername ||
              userData.contact === inputUsername2.replace(/x/g, "+63") ||
              userData.email === inputUsername) &&
            userData.password === inputPassword
          ) {
            // Update session storage
            sessionStorage.setItem("log", "online");
            sessionStorage.setItem("uid", userData.id);
            sessionStorage.setItem("sid", userData.store_id);
            console.log("Successfully logged in", userData);
            success = true;

            // Check if the user has devices
            if (userData.device) {
              let deviceExists = false;
              // Iterate over each device
              Object.values(userData.device).forEach((device) => {
                if (device.id === deviceID) {
                  // Update the status of the device to "online"
                  const deviceRef = ref(
                    database,
                    `authentication/${userData.id}/device/${device.id}/log`
                  );
                  set(deviceRef, "online")
                    .then(() => {
                      console.log("Device status updated to online");
                    })
                    .catch((error) => {
                      console.error("Error updating device status:", error);
                    });
                  deviceExists = true;
                }
              });
              if (!deviceExists) {
                // If the deviceID is not found in the user's devices, add the new device
                const newDeviceRef = ref(
                  database,
                  `authentication/${userData.id}/device/${deviceID}`
                );
                set(newDeviceRef, {
                  id: deviceID,
                  type: deviceType,
                  brand: deviceBrand,
                  browser: deviceBrowser,
                  log: "online",
                })
                  .then(() => {
                    console.log("New device added");
                  })
                  .catch((error) => {
                    console.error("Error adding new device:", error);
                  });
              }
            } else {
              // If the user has no devices, add the new device
              const newDeviceRef = ref(
                database,
                `authentication/${userData.id}/device/${deviceID}`
              );
              set(newDeviceRef, {
                id: deviceID,
                type: deviceType,
                brand: deviceBrand,
                browser: deviceBrowser,
                log: "online",
              })
                .then(() => {
                  console.log("New device added");
                })
                .catch((error) => {
                  console.error("Error adding new device:", error);
                });
            }
          }
        });

        if (success) {
          setToastMessage("Login successful!");
          setShowToast(true);
          setTimeout(function () {
            navigate("/main");
          }, 900);
        } else {
          setShowToast(true);
          setToastMessage("Incorrect username or password.");
        }
      } else {
        console.error("No users found");
      }
    } catch (error) {
      console.error("Error logging in:", error.message);
    }
  };

  const styles = {
    backgroundImage: "url(/bg.webp)",
  };

  const forgetPassword = () => {
    setToastMessage("Coming Soon!");
    setShowToast(true);
  };

  return (
    <div
      className="bg-gray-700 bg-cover bg-blend-overlay flex items-center justify-center h-screen"
      style={styles}
    >
      <div className="">
        <div className="flex justify-center mx-auto w-auto space-x-2">
          <img className=" h-[5em] " src={imageConfig.DALogo} alt="Farm Logo" />
          <img
            className=" h-[5em] "
            src={imageConfig.AppLogo}
            alt="Farm Logo"
          />
          <img className=" h-[5em] " src={imageConfig.BGPH} alt="Farm Logo" />
        </div>
        <div className="mt-5 p-8 rounded">
          <form id="loginForm" className="space-y-1" onSubmit={handleSignIn}>
            <div className="text-left">
              <label htmlFor="contact" className="text-sm text-gray-200">
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
              <label htmlFor="password" className="text-sm text-gray-200">
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

          <div className="mt-4 space-y-3 text-gray-700 text-center">
            <NavLink
              to="#"
              onClick={forgetPassword}
              className="text-sm text-neutral-100"
            >
              Forgot Password?
            </NavLink>
            <p className="text-gray-200">
              Don't have an account?{" "}
              <NavLink to="/register" className="text-green-600 font-semibold">
                Register
              </NavLink>
            </p>
          </div>
        </div>
        <div className="flex items-end text-center py-4 text-sm text-gray-200">
          <p className="mx-auto mt-auto ">{appversion}</p>
        </div>
      </div>

      {showToast && (
        <Toast message={toastMessage} onClose={() => setShowToast(false)} />
      )}
      {version !== "" && version !== BRAND.version ? ( // Check if version is not equal to BRAND.version
        <AppUpdateModal
          newVersion={version}
          onUpdate={() => {
            setToastMessage("Updated Successfully");
            setShowToast(true);
            setTimeout(() => {
              window.location.reload();
            }, 3000);
          }}
        />
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default SignInPages;
