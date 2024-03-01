import React, { useState, useEffect } from "react";
import { imageConfig } from "../../Configuration/config-file";
import InputMask from "react-input-mask";
import { NavLink, useNavigate } from "react-router-dom";
import { getDatabase, ref, get, set } from "firebase/database";
import { FacebookAuth, FacebookMobileAuth } from "../../services/user/auth.service";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import firebaseDB from "../../Configuration/config";

import { v4 as uuidv4 } from "uuid";
import Toast from "../../Components/Notifications/Toast";
import { BRAND } from "../../services/configurations/application.config";
import AppUpdateModal from './../../Components/modals/AppUpdateModal';
import { generateUniqueID } from "../../services/user/generator.service";
const deviceDetect = require("device-detect")();

function isBlank(value) {
  return value.trim() === "";
}

function resetConsumerForm() {
  const contactInput = document.getElementById("phoneNumber");
  const passwordInput = document.getElementById("password");
  const confirmPasswordInput = document.getElementById("confirmPassword");

  if (contactInput && passwordInput && confirmPasswordInput) {
    contactInput.value = "";
    passwordInput.value = "";
    confirmPasswordInput.value = "";
  } else {
    console.error("One or more form elements not found.");
  }
}

const Registration = () => {
  const [version, setVersion] = useState("");
  const [consumerFormData, setConsumerFormData] = useState({
    contact: "",
    password: "",
    confirmPassword: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [deviceID, setDeviceID] = useState(null);
  const [deviceType, setDeviceType] = useState(null);
  const [deviceBrand, setDeviceBrand] = useState(null);
  const [deviceBrowser, setDeviceBrowser] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const db = firebaseDB();


  async function FacebookButtonClicked() {
    try {
        const fbuser = await FacebookAuth();
        
        console.log("facebook user", fbuser);
        
        if (!fbuser) {
            alert("Facebook authentication failed.");
            return;
        }

        const userAuthRef = ref(db, "authentication");
        const snapshot = await get(userAuthRef);

        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const userData = childSnapshot.val();
                if (userData.uid === fbuser._tokenResponse.localId) {
                    sessionStorage.setItem("uid", userData.store_id);
                    sessionStorage.setItem("sid", userData.id);
                    navigate("/main/");
                    return;
                }
            });
        }

        const userID = generateUniqueID();
        const userRef = ref(db, "users_information/" + userID);
        const authRef = ref(db, "authentication/" + userID);
        const walletRef = ref(db, "user_wallet/" + userID);
        const userAddressRef = ref(db, "users_address/" + userID);
        const storeRef = ref(db, "store_information/" + "None");

        const user = {
            id: userID,
            uid: fbuser._tokenResponse.localId,
            points: 0,
            type: "consumer",
            bday: "N/A",
            email: "N/A",
            gender: "N/A",
            first_name: "No name",
            fullname: fbuser._tokenResponse.displayName,
            last_name: "",
            middle_name: "",
            suffix: "",
            contact: "No Contact",
        };

        const authData = {
            id: userID,
            uid: fbuser._tokenResponse.localId,
            email: "N/A",
            username: userID,
            store_id: "None",
            contact: consumerFormData.contact,
            password: consumerFormData.password,
            device: {
                [deviceID]: {
                    id: deviceID || " ",
                    type: deviceType || " ",
                    brand: deviceBrand || " ",
                    browser: deviceBrowser || " ",
                    log: "online",
                },
            },
        };

        const walletData = {
            id: userID,
            balance: 0,
            points: 0,
        };

        const userAddress = {
            id: userID,
            default: {
                region: "N/A",
                province: "N/A",
                city: "N/A",
                barangay: "No Address",
                landmark: "",
                person: "N/A",
                maplink: "N/A",
                contact: "No Contact",
                address_name: "N/A",
                latitude: "0",
                longitude: "0",
            },
            additional: {
                0: {
                    id: 0,
                    region: "N/A",
                    province: "N/A",
                    city: "N/A",
                    barangay: "No Address",
                    landmark: "",
                    person: "N/A",
                    maplink: "",
                    contact: "No Contact Person",
                    address_name: "N/A",
                    latitude: "0",
                    longitude: "0",
                },
            },
        };

        const storeData = {
            id: "None",
            name: "N/A",
        };

        await Promise.all([
            set(userRef, user),
            set(storeRef, storeData),
            set(userAddressRef, userAddress),
            set(authRef, authData),
            set(walletRef, walletData),
        ]);

        resetConsumerForm();
        setShowModal(true);
        sessionStorage.setItem("uid", userID);
        sessionStorage.setItem("sid", "None");
        console.log("Successfully logged in", userID);
    } catch (error) {
        console.error("Error during Facebook login:", error);
    }
}




// async function FacebookModeButtonClicked() {
//   try {
//       const fbuser = await FacebookMobileAuth();
//       console.log("facebook user", fbuser);
      
//       if (!fbuser) {
//           alert("Facebook authentication failed.");
//           return;
//       }

//       const userAuthRef = ref(db, "authentication");
//       const snapshot = await get(userAuthRef);

//       if (snapshot.exists()) {
//           snapshot.forEach((childSnapshot) => {
//               const userData = childSnapshot.val();
//               if (userData.uid === fbuser._tokenResponse.localId) {
//                   sessionStorage.setItem("uid", userData.store_id);
//                   sessionStorage.setItem("sid", userData.id);
//                   navigate("/main/");
//                   return;
//               }
//           });
//       }

//       const userID = generateUniqueID();
//       const userRef = ref(db, "users_information/" + userID);
//       const authRef = ref(db, "authentication/" + userID);
//       const walletRef = ref(db, "user_wallet/" + userID);
//       const userAddressRef = ref(db, "users_address/" + userID);
//       const storeRef = ref(db, "store_information/" + "None");

//       const user = {
//           id: userID,
//           uid: fbuser._tokenResponse.localId,
//           points: 0,
//           type: "consumer",
//           bday: "N/A",
//           email: "N/A",
//           gender: "N/A",
//           first_name: "No name",
//           fullname: fbuser._tokenResponse.displayName,
//           last_name: "",
//           middle_name: "",
//           suffix: "",
//           contact: "No Contact",
//       };

//       const authData = {
//           id: userID,
//           uid: fbuser._tokenResponse.localId,
//           email: "N/A",
//           username: userID,
//           store_id: "None",
//           contact: consumerFormData.contact,
//           password: consumerFormData.password,
//           device: {
//               [deviceID]: {
//                   id: deviceID || " ",
//                   type: deviceType || " ",
//                   brand: deviceBrand || " ",
//                   browser: deviceBrowser || " ",
//                   log: "online",
//               },
//           },
//       };

//       const walletData = {
//           id: userID,
//           balance: 0,
//           points: 0,
//       };

//       const userAddress = {
//           id: userID,
//           default: {
//               region: "N/A",
//               province: "N/A",
//               city: "N/A",
//               barangay: "No Address",
//               landmark: "",
//               person: "N/A",
//               maplink: "N/A",
//               contact: "No Contact",
//               address_name: "N/A",
//               latitude: "0",
//               longitude: "0",
//           },
//           additional: {
//               0: {
//                   id: 0,
//                   region: "N/A",
//                   province: "N/A",
//                   city: "N/A",
//                   barangay: "No Address",
//                   landmark: "",
//                   person: "N/A",
//                   maplink: "",
//                   contact: "No Contact Person",
//                   address_name: "N/A",
//                   latitude: "0",
//                   longitude: "0",
//               },
//           },
//       };

//       const storeData = {
//           id: "None",
//           name: "N/A",
//       };

//       await Promise.all([
//           set(userRef, user),
//           set(storeRef, storeData),
//           set(userAddressRef, userAddress),
//           set(authRef, authData),
//           set(walletRef, walletData),
//       ]);

//       resetConsumerForm();
//       setShowModal(true);
//       sessionStorage.setItem("uid", userID);
//       sessionStorage.setItem("sid", "None");
//       console.log("Successfully logged in", userID);
//   } catch (error) {
//       console.error("Error during Facebook login:", error);
//   }
// }



  useEffect(() => {
    const fetchVersion = async () => {
      try {
        const database = getDatabase();
        const versionRef = ref(database, "0_config_control/version");
        const snapshot = await get(versionRef);
        if (snapshot.exists()) {
          const version = snapshot.val();

          setVersion(version);


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
      if (!id) {
        id = uuidv4();
        localStorage.setItem("deviceID", id);
      }

      setDeviceID(id);
    };

    // Function to determine device type, brand, and browser
    const determineDeviceInfo = () => {
      setDeviceType(deviceDetect.device || "Unknown");
      setDeviceBrand(deviceDetect.device || "Unknown");
      setDeviceBrowser(deviceDetect.browser || "Unknown");
    };

    const autoLoginIfOnline = async () => {
      if (deviceID) {
        const db = firebaseDB();
        const authRef = ref(db, "authentication");
        const snapshot = await get(authRef);

        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const userData = childSnapshot.val();
            const devices = userData.device;
            if (devices) {
              // Iterate over devices
              for (const deviceKey in devices) {
                const deviceData = devices[deviceKey];
                if (deviceData.id === deviceID && deviceData.log === "online") {
                  // If the device is marked as online, automatically log in
                  sessionStorage.setItem("log", "online");
                  sessionStorage.setItem("uid", userData.id);
                  sessionStorage.setItem("sid", userData.store_id);
                  console.log("Automatically logged in");
                  // You can navigate to the desired page after login
                  navigate("/main/");
                  return; // Exit loop if found online device
                }
              }
            }
          });
        }
      }
    };

    fetchDeviceID();
    determineDeviceInfo();
    autoLoginIfOnline();

    // Cleanup function if needed
    return () => {
      // Any cleanup code
    };
  }, [deviceID]); // Add deviceID as dependency to re-run the effect when it changes

  const handleConsumerSubmit = async (e) => {
    e.preventDefault();

    if (
      isBlank(consumerFormData.contact) ||
      isBlank(consumerFormData.password) ||
      isBlank(consumerFormData.confirmPassword)
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    if (consumerFormData.password !== consumerFormData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    const userRefCheck = ref(db, "users_information");

    try {
      const snapshot = await get(userRefCheck);
      if (snapshot.exists()) {
        let contactExists = false;
        snapshot.forEach((childSnapshot) => {
          const userData = childSnapshot.val();
          if (userData.contact === consumerFormData.contact) {
            contactExists = true;
            return; // Exit loop if contact is found
          }
        });

        if (contactExists) {
          setToastMessage(
            "The phone number is already exist , please use other phone number."
          );
          setShowToast(true); // Show toast for existing contact
          return; // Exit function if contact exists
        }
      }

      const userID = generateUniqueID();
      const userRef = ref(db, "users_information/" + userID);
      const user = {
        id: userID,
        points: 0,
        type: "consumer",
        bday: "N/A",
        email: "N/A",
        gender: "N/A",
        first_name: "No name",
        fullname: "No name",
        last_name: "",
        middle_name: "",
        suffix: "",
        contact: consumerFormData.contact,
      };

      const authRef = ref(db, "authentication/" + userID);
      const authData = {
        id: userID,
        email: "N/A",
        username: userID,
        store_id: "None",
        contact: consumerFormData.contact,
        password: consumerFormData.password,
        device: {
          [deviceID]: {
            id: deviceID || " ",
            type: deviceType || " ",
            brand: deviceBrand || " ",
            browser: deviceBrowser || " ",
            log: "online",
          },
        },
      };

      sessionStorage.setItem("uid", userID);
      sessionStorage.setItem("sid", "None");
      console.log("Successfully logged in", userID);

      const walletRef = ref(db, "user_wallet/" + userID);
      const walletData = {
        id: userID,
        balance: 0,
        points: 0,
      };

      const userAddressRef = ref(db, "users_address/" + userID);
      const userAddress = {
        id: userID,
        default: {
          region: "N/A",
          province: "N/A",
          city: "N/A",
          barangay: "No Address",
          landmark: "",
          person: "N/A",
          maplink: "N/A",
          contact: consumerFormData.contact,
          address_name: "N/A",
          latitude: "0",
          longitude: "0",
        },
        additional: {
          0: {
            id: 0,
            region: "N/A",
            province: "N/A",
            city: "N/A",
            barangay: "No Address",
            landmark: "",
            person: "N/A",
            maplink: "",
            contact: "No Contact Person",
            address_name: "N/A",
            latitude: "0",
            longitude: "0",
          },
        },
      };

      const storeRef = ref(db, "store_information/" + "None");
      const storeData = {
        id: "None",
        name: "N/A",
      };

      try {
        await Promise.all([
          set(userRef, user),
          set(storeRef, storeData),
          set(userAddressRef, userAddress),
          set(authRef, authData),
          set(walletRef, walletData),
        ]);

        resetConsumerForm();
        setShowModal(true);
      } catch (error) {
        console.error("Error saving data to database:", error);
      }
    } catch (error) {
      console.error("Error checking contact:", error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    navigate("/main/");
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const CoomingSoon = () => {
    setToastMessage("Coming Soon!");
    setShowToast(true);
  };

  return (
    <div className="flex flex-col items-center h-screen bg-white sm:px-6 lg:px-8">
      <div className="max-w-md w-full my-auto bg-white p-8">
        <div>
          <div className="flex justify-center mx-auto w-auto space-x-2">
            <img
              className=" h-[5em] "
              src={imageConfig.DALogo}
              alt="Farm Logo"
            />
            <img
              className=" h-[5em] "
              src={imageConfig.AppLogo}
              alt="Farm Logo"
            />
            <img className=" h-[5em] " src={imageConfig.BGPH} alt="Farm Logo" />
          </div>

          <h2 className="mt-4 text-center text-xl font-extrabold text-gray-500">
            Create an Account
          </h2>
        </div>
        <form className="mt-4 space-y-4" onSubmit={handleConsumerSubmit}>
          {/* Form inputs */}
          <div className="shadow-sm space-y-2">
            {/* Phone Number Input */}
            <div>
              <label htmlFor="phoneNumber" className="sr-only">
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
                value={consumerFormData.contact}
                onChange={(e) =>
                  setConsumerFormData({
                    ...consumerFormData,
                    contact: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={passwordVisible ? "text" : "password"} // Show/hide password based on visibility state
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none rounded-b-md focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={consumerFormData.password}
                  onChange={(e) =>
                    setConsumerFormData({
                      ...consumerFormData,
                      password: e.target.value,
                    })
                  }
                />
                {/* Password visibility toggle icon */}
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 cursor-pointer"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="confirm-password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
                value={consumerFormData.confirmPassword}
                onChange={(e) =>
                  setConsumerFormData({
                    ...consumerFormData,
                    confirmPassword: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Create Account
            </button>
          </div>
        </form>
        {/* Modal for Successful Registration */}
        {showModal && (
          <div className="fixed z-50 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                      <svg
                        className="h-6 w-6 text-green-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Registration Successful!
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          You have successfully created your account.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    onClick={closeModal}
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="text-center">
          <p className="mt-2 text-xs text-gray-600">Or</p>
          <div className="mt-2">
            <button
              onClick={FacebookButtonClicked}
              type="button"
              className="hidden sm:hidden lg:block  inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-blue-500 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
             
              Sign in with Facebook
            </button>
            <button
              onClick={FacebookButtonClicked}
              type="button"
              className="block sm:block lg:hidden inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-blue-500 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign in with Facebook
            </button>
            {/* <button
              type="button"
              className="mt-2 inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-red-500 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <span className="sr-only">Sign up with Gmail</span>
              Sign up with Gmail
            </button> */}
          </div>
        </div>
        <div className="text-center mt-2">
          <p className="text-xs text-gray-600">
            By signing up, you agree to our{" "}
            <NavLink
              to={"/info/terms-and-conditions"}
              className="font-medium text-green-500 hover:text-green-600"
            >
              Terms and Conditions
            </NavLink>{" "}
            and{" "}
            <NavLink
              to={"/info/privacy-policy"}
              className="font-medium text-green-500 hover:text-green-600"
            >
              Privacy Policy
            </NavLink>
          </p>
          <p className="mt-3 text-gray-600">
            Already have an account?{" "}
            <NavLink to={"/"} className="text-green-600 font-semibold">
              Sign in
            </NavLink>
          </p>
        </div>
      </div>
      {/* Version */}
      <div className="flex items-end text-center py-4 text-sm text-gray-600 mt-auto bg-white">
        <p>{version}</p>
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
      ) : (<div>

      </div>)}
    </div>
  );
};

export default Registration;
