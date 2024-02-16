import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { imageConfig } from '../Configuration/config-file';
import InputMask from 'react-input-mask';
import { NavLink, useNavigate } from 'react-router-dom';
import { getDatabase, ref, get , set} from 'firebase/database';
import firebaseDB from '../Configuration/config'

// Function to check if a value is blank
function isBlank(value) {
    return value.trim() === '';
}


// Function to generate unique ID
function generateUniqueID() {
    var currentDate = new Date();
    var year = currentDate.getFullYear();
    var month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    var day = ('0' + currentDate.getDate()).slice(-2);
    var hours = ('0' + currentDate.getHours()).slice(-2);
    var minutes = ('0' + currentDate.getMinutes()).slice(-2);
    var random4DigitNumber = ('000' + Math.floor(1000 + Math.random() * 9000)).slice(-4);

    return `${year}-${month}${day}-${hours}${minutes}-${random4DigitNumber}`;
}

// Function to reset consumer form
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
  const [version, setVersion] = useState(""); // Define useState here
  const [consumerFormData, setConsumerFormData] = useState({
    contact: '',
    password: '',
    confirmPassword: '',
});
const db = firebaseDB();


  useEffect(() => {
    // Fetch version from Firebase
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

  const handleConsumerSubmit = async (e) => {
    e.preventDefault();

    console.log("handleConsumerSubmit function called");
    console.log("Contact:", consumerFormData.contact);
    console.log("Password:", consumerFormData.password);
    console.log("Confirm Password:", consumerFormData.confirmPassword);

    // Validate required inputs
    if (isBlank(consumerFormData.contact) || isBlank(consumerFormData.password) || isBlank(consumerFormData.confirmPassword)) {
        alert("Please fill in all required fields.");
        return;
    }



    // Validate password match
    if (consumerFormData.password !== consumerFormData.confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    const userID = generateUniqueID();
    console.log(userID);
    const userRef = ref(db, 'users_information/' + userID);
    const user = {
        id: userID,
        points: 0,
        type: "consumer",
        bday: "N/A",
        email: "N/A",
        gender: "N/A",
        first_name: "",
        last_name: "",
        middle_name: "",
        suffix: "",
        contact: consumerFormData.contact

    };

    const authRef = ref(db, 'authentication/' + userID);
    const authData = {
        id: userID,
        email: "N/A",
        username: "N/A",
        store_id: "None",
        contact: consumerFormData.contact,
        password: consumerFormData.password
    };

    const walletRef = ref(db, 'user_wallet/' + userID);
    const walletData = {
        id: userID,
        balance: 0,
        points: 0,
    };

    const userAddressRef = ref(db, 'users_address/' + userID);
    const userAddress = {
        id: userID,
        default: {
            region: "",
            province: "",
            city: "",
            barangay: "",
            landmark: "",
            fullname: "",
            maplink: ""

        }

    };

    const storeRef = ref(db, 'store_information/' + 'None');
    const storeData = {
        id: "None",
        name: "N/A"
    };


    try {
        await set(userRef, user);
        await set(storeRef, storeData);
        await set(userAddressRef, userAddress);
        await set(authRef, authData);
        await set(walletRef, walletData);

        resetConsumerForm(); // Call function to reset consumer form
    } catch (error) {
        console.error("Error saving data to database:", error);
    }
};

  return (
    <div className="flex flex-col items-center h-screen bg-white sm:px-6 lg:px-8 selection:">
      <div className="max-w-md w-full bg-white p-8">
        <div>
          <img className="mx-auto h-20 w-auto overflow-hidden" src={imageConfig.AppLogo} alt="Farm Logo" />
          <h2 className="mt-4 text-center text-xl font-extrabold text-gray-500">
            Create an Account
          </h2>
        </div>
        <form className="mt-4 space-y-4"  onSubmit={handleConsumerSubmit}>
          <div className="shadow-sm space-y-2">
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
                onChange={(e) => setConsumerFormData({ ...consumerFormData, contact: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none rounded-b-md focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={consumerFormData.password}
                onChange={(e) => setConsumerFormData({ ...consumerFormData, password: e.target.value })}
              />
            </div>
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
                onChange={(e) => setConsumerFormData({ ...consumerFormData, confirmPassword: e.target.value })}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Create Account
            </button>
          </div>
        </form>
        <div className="text-center">
          <p className="mt-2 text-xs text-gray-600">
            Or
          </p>
          <div className="mt-2">
            <button
              type="button"
              className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-blue-500 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span className="sr-only">Sign up with Facebook</span>
              Sign up with Facebook
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
            By signing up, you agree to our{' '}
            <a href="#" className="font-medium text-green-500 hover:text-green-600">
              Terms and Conditions
            </a>{' '}
            and{' '}
            <a href="#" className="font-medium text-green-500 hover:text-green-600">
              Privacy Policy
            </a>
          </p>
          <p className="mt-3 text-sm text-gray-600">
            Already have an account?{' '}
            <NavLink to={"/signin"} className="font-medium text-green-500 hover:text-green-600">
              Sign in
            </NavLink>
          </p>
        </div>
      </div>
      <div className='fixed bottom-0 text-center py-4 text-xs text-gray-600'>
        <p> {version}</p>
      </div>
    </div>
  );
};

export default Registration;
