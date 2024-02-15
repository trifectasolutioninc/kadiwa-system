import React, { useState , useEffect} from 'react';
import { imageConfig } from '../Configuration/config-file';
import { Link, NavLink, useHistory } from 'react-router-dom';
import firebaseDB from '../Configuration/config'
import { ref, set } from 'firebase/database';
import {
  regions,
  regionByCode,
  provinces,
  provincesByCode,
  provinceByName,
  cities,
  barangays,
} from 'select-philippines-address';
import { Wallet } from '@mui/icons-material';


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
  document.getElementById("contact").value = "";
  document.getElementById("password").value = "";
  document.getElementById("confirmPassword").value = "";
}
// Function to reset partner form
function resetPartnerForm() {
  document.getElementById("ownerContact").value = "";
  document.getElementById("partnerPassword").value = "";
  document.getElementById("confirmPartnerPassword").value = "";
  document.getElementById("storeName").value = "";
  document.getElementById("storeType").value = "";
  document.getElementById("region-text").value = "";
  document.getElementById("province-text").value = "";
  document.getElementById("city-text").value = "";
  document.getElementById("barangay-text").value = "";
  document.getElementById("landmark").value = "";
  document.getElementById("ownerName").value = "";
}


const RegistrationPage = () => {
  const [activeForm, setActiveForm] = useState('consumer');
  const [selectedRegion, setSelectedRegion] = useState('');  // Set default value accordingly
  const [selectedProvince, setSelectedProvince] = useState('');  // Set default value accordingly
  const [selectedCity, setSelectedCity] = useState('');  // Set default value accordingly
  const [selectedBarangay, setSelectedBarangay] = useState('');  // Set default value accordingly
  const [regionsData, setRegionsData] = useState([]);  // Add this line
  const [provincesData, setProvincesData] = useState([]);  // Add this line
  const [citiesData, setCitiesData] = useState([]);  // Add this line
  const [barangaysData, setBarangaysData] = useState([]);  // Add this line
  const db = firebaseDB();
  

    const switchForm = (formType) => {
        setActiveForm(formType);
    };

    // Add useEffect to fetch regions when the component mounts
    useEffect(() => {
      fetchRegions();
    }, []);

    const fetchRegions = async () => {
      try {
          const regionsData = await regions();
          // console.log(regionsData);
          if (regionsData.length > 0) {
              const defaultRegion = regionsData[0].region_code;
              setSelectedRegion(defaultRegion);
              setRegionsData(regionsData);  // Add this line
              fetchProvinces(defaultRegion);
          }
      } catch (error) {
          console.error('Error fetching regions:', error);
      }
  };

  const fetchProvinces = async (regionCode) => {
      try {
          const provinceData = await provinces(regionCode);
          // console.log(provinceData);
          if (provinceData.length > 0) {
              const defaultProvince = provinceData[0].province_code;
              setSelectedProvince(defaultProvince);
              setProvincesData(provinceData);  // Add this line
              fetchCities(defaultProvince);
          }
      } catch (error) {
          console.error('Error fetching provinces:', error);
      }
  };

  const fetchCities = async (provinceCode) => {
      try {
          const cityData = await cities(provinceCode);
          // console.log(cityData);
          if (cityData.length > 0) {
              const defaultCity = cityData[0].city_code;
              setSelectedCity(defaultCity);
              setCitiesData(cityData);  // Add this line
              fetchBarangays(defaultCity);
          }
      } catch (error) {
          console.error('Error fetching cities:', error);
      }
  };

  const fetchBarangays = async (cityCode) => {
    try {
        const barangayData = await barangays(cityCode);
        // console.log(barangayData);
        if (barangayData.length > 0) {
            const defaultBarangay = barangayData[0].barangay_code;
            setSelectedBarangay(defaultBarangay);
            setBarangaysData(barangayData);  // Add this line
        }
    } catch (error) {
        console.error('Error fetching barangays:', error);
    }
};

const [consumerFormData, setConsumerFormData] = useState({
  contact: '',
  password: '',
  confirmPassword: '',
});


const [partnerFormData, setPartnerFormData] = useState({
  ownerContact: '',
  partnerPassword: '',
  confirmPartnerPassword: '',
  storeName: '',
  storeType: '',
  region: '',
  province: '',
  city: '',
  barangay: '',
  landmark: '',
  ownerName: '',
});

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

const handlePartnerSubmit = async (e) => {
  e.preventDefault();

  // Validate required inputs
  if (isBlank(partnerFormData.ownerContact) || isBlank(partnerFormData.partnerPassword) || isBlank(partnerFormData.confirmPartnerPassword)) {
    alert("Please fill in all required fields.");
    return;
  }

  // Validate password match
  if (partnerFormData.partnerPassword !== partnerFormData.confirmPartnerPassword) {
    alert("Passwords do not match.");
    return;
  }
  const authRef = ref(db, 'authentiction/' + generateUniqueID());
  const authdata = {
    id: generateUniqueID(),
    store_id: "None",
    email: "N/A",
    contact: partnerFormData.ownerContact,
    password: partnerFormData.partnerPassword
  };


  const userRef = ref(db, 'users_information/' + generateUniqueID());
  const partner = {
    id: generateUniqueID(),
    points: 0,
    usertype: "Partner",
    info_status: "Not Complete",
    store_status: "Not Accredited",
    birthday: "...",
    gender: "...",
    storeName: partnerFormData.storeName,
    storeType: partnerFormData.storeType,
    region: partnerFormData.region,
    province: partnerFormData.province,
    city: partnerFormData.city,
    barangay: partnerFormData.barangay,
    landmark: partnerFormData.landmark,
    fullname: partnerFormData.ownerName,
    contact: partnerFormData.ownerContact,
    password: partnerFormData.partnerPassword
  };

  const useraddRef = ref(db, 'users_address/' + generateUniqueID());
  const useradd = {
    id: generateUniqueID(),

    storeName: partnerFormData.storeName,
    storeType: partnerFormData.storeType,
    region: partnerFormData.region,
    province: partnerFormData.province,
    city: partnerFormData.city,
    barangay: partnerFormData.barangay,
    landmark: partnerFormData.landmark,
    fullname: partnerFormData.ownerName,
    contact: partnerFormData.ownerContact,
    password: partnerFormData.partnerPassword
  };


  const storeRef = ref(db, 'users_address/' + 'N/A');
  const store = {
    id: generateUniqueID(),
    name: partnerFormData.storeName,
    storeType: partnerFormData.storeType
    
  };



  try {
    await set(userRef, partner);
    resetPartnerForm(); // Call function to reset partner form
  } catch (error) {
    console.error("Error saving data to database:", error);
  }
};



    const renderForm = () => {
        switch (activeForm) {
            case 'consumer':
                return (
                  <div id="consumerForm" className="mt-8 p-8 rounded">
                  <form action="#" className="space-y-4" onSubmit={handleConsumerSubmit}>
                      <div className="space-y-2 text-left">
                          <label  className="text-sm text-white">Phone Number</label>
                          <input
                            type="tel"
                            id="contact"
                            name="contact"
                            value={consumerFormData.contact}
                            onChange={(e) => setConsumerFormData({ ...consumerFormData, contact: e.target.value })}
                            placeholder="Phone Number"
                            className="w-full p-2 border rounded-md"
                            required
                          />

                      </div>
                      <div className="space-y-2 text-left">
                          <label className="text-sm text-white">Password</label>
                          <input
                            type="password"
                            id="password"
                            name="password" 
                            value={consumerFormData.password}  
                            onChange={(e) => setConsumerFormData({ ...consumerFormData, password: e.target.value })}
                            placeholder="Password"
                            className="w-full p-2 border rounded-md"
                            required
                          />

                      </div>
                      <div className="space-y-2 text-left">
                          <label  className="text-sm text-white">Confirm Password</label>
                          <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"  
                            value={consumerFormData.confirmPassword}  
                            onChange={(e) => setConsumerFormData({ ...consumerFormData, confirmPassword: e.target.value })}
                            placeholder="Confirm Password"
                            className="w-full p-2 border rounded-md"
                            required
                          />
                      </div>
                      <div className="items-center">
                          <button type="submit" id="consumerSubmit"  className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:border-green-300">
                              Register
                          </button>
                      </div>
                  </form>
                  <div className="mt-4 text-gray-700">
                      <p className="text-white">Already have an account ? <NavLink to="/" className="text-blue-500">Login</NavLink></p>
                  </div>
              </div>
                );
            case 'partner':
                return (
                  <div id="partnerForm" className=" mt-8 p-8 rounded overflow-auto" onSubmit={handlePartnerSubmit}>
                  <form action="#" className="space-y-4">
           
                      <div className="space-y-2 text-left">
                          <label htmlFor="storeName" className="text-sm text-white">Store Name</label>
                          <input type="text" id="storeName" name="storeName" placeholder="Store Name" className="w-full p-2 border rounded-md" required/>
                      </div>
                      <div className="space-y-2 text-left">
                          <label htmlFor="storeType" className="text-sm text-white">Type of Store</label>
                          <select id="storeType" name="storeType" className="w-full p-2 border rounded-md" required>
                              <option value="physical">Physical Store</option>
                              <option value="online">Online Store</option>
                              <option value="omnichannel">Omnichannel Store (Physical/Online)</option>
                          </select>
                      </div>            
                      
                      <div className="space-y-2 text-left">
                        <label htmlFor="region" className="text-sm text-white">
                            Region
                        </label>
                        <select
                            id="region"
                            name="region"
                            className="w-full p-2 border rounded-md"
                            required
                            value={selectedRegion|| ''}
                            onChange={(e) => {
                                const regionCode = e.target.value;
                                setSelectedRegion(regionCode);
                                fetchProvinces(regionCode);
                            }}
                        >
                            {regionsData.map((region) => (
                                <option key={region.region_code} value={region.region_code}>
                                    {region.region_name}
                                </option>
                            ))}
                        </select>
                        <input type="hidden" name="region_text" id="region-text" />
                    </div>

                    <div className="space-y-2 text-left">
                        <label htmlFor="province" className="text-sm text-white">
                            Province
                        </label>
                        <select
                            id="province"
                            name="province"
                            className="w-full p-2 border rounded-md"
                            required
                            value={selectedProvince|| ''}
                            onChange={(e) => {
                                const provinceCode = e.target.value;
                                setSelectedProvince(provinceCode);
                                fetchCities(provinceCode);
                            }}
                        >
                            {provincesData.map((province) => (
                                <option key={province.province_code} value={province.province_code}>
                                    {province.province_name}
                                </option>
                            ))}
                        </select>
                        <input type="hidden" name="province_text" id="province-text" />
                    </div>

                    <div className="space-y-2 text-left">
                        <label htmlFor="city" className="text-sm text-white">
                            Municipality/City
                        </label>
                        <select
                            id="city"
                            name="city"
                            className="w-full p-2 border rounded-md"
                            required
                            value={selectedCity|| ''}
                            onChange={(e) => {
                                const cityCode = e.target.value;
                                setSelectedCity(cityCode);
                                fetchBarangays(cityCode);
                            }}
                        >
                            {citiesData.map((city) => (
                                <option key={city.city_code} value={city.city_code}>
                                    {city.city_name}
                                </option>
                            ))}
                        </select>
                        <input type="hidden" name="city_text" id="city-text" />
                    </div>

                    <div className="space-y-2 text-left">
                        <label htmlFor="barangay" className="text-sm text-white">
                            Barangay
                        </label>
                        <select
                            id="barangay"
                            name="barangay"
                            className="w-full p-2 border rounded-md"
                            required
                            value={selectedBarangay|| ''}
                            onChange={(e) => setSelectedBarangay(e.target.value)}
                        >
                            {barangaysData.map((barangay) => (
                                <option key={barangay.brgy_code} value={barangay.brgy_code}>
                                    {barangay.brgy_name}
                                </option>
                            ))}
                        </select>
                        <input type="hidden" name="barangay_text" id="barangay-text" />
                    </div>


                      <div className="space-y-2 text-left">
                          <label htmlFor="landmark" className="text-sm text-white">Store Landmark (Optional)</label>
                          <input type="text" id="landmark" name="landmark" placeholder="Build No/Street/Other" className="w-full p-2 border rounded-md"/>
                      </div>
                      
                      <div className="space-y-2 text-left">
                          <label htmlFor="ownerName" className="text-sm text-white">Owner Fullname</label>
                          <input type="text" id="ownerName" name="ownerName" placeholder="Owner Fullname" className="w-full p-2 border rounded-md" required/>
                      </div>
                      <div className="space-y-2 text-left">
                          <label htmlFor="ownerContact" className="text-sm text-white">Contact Number</label>
                          <input type="tel" id="ownerContact" name="ownerContact" placeholder="Contact Number" className="w-full p-2 border rounded-md" required/>
                      </div>
                      <div className="space-y-2 text-left">
                          <label htmlFor="partnerPassword" className="text-sm text-white">Password</label>
                          <input type="password" id="partnerPassword" name="partnerPassword" placeholder="Password" className="w-full p-2 border rounded-md" required/>
                      </div>
                      <div className="space-y-2 text-left">
                          <label htmlFor="confirmPartnerPassword" className="text-sm text-white">Confirm Password</label>
                          <input type="password" id="confirmPartnerPassword" name="confirmPartnerPassword" placeholder="Confirm Password" className="w-full p-2 border rounded-md" required/>
                      </div>
                      <div className="items-center">
                          <button type="submit" id="partnerSubmit" onClick={handlePartnerSubmit} className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:border-green-300">
                              Register
                          </button>
                      </div>
                  </form>
                  <div className="mt-4 text-gray-700">
                      <p className="text-white">Already have an account ? <NavLink to="/" className="text-blue-500">Login</NavLink></p>
                  </div>
                  </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col m-0 items-center text-center justify-center max-h-screen h-screen" style={{ background: 'linear-gradient(to bottom, #309340, #0D5B19)' }}>
            <div className="flex items-center p-4 justify-between gap-2">
              <span className="text-2xl font-bold" style={{ color: '#FAFF00' }}>Welcome to</span>
              <img src={imageConfig.KadiwaText} alt="Logo" className="h-9" />
          </div>

            <div>
                <button id="consumerBtn" className={`p-1 font-bold rounded-2xl ${activeForm === 'consumer' ? 'bg-blue-500 text-white' : 'bg-white text-black'}`} onClick={() => switchForm('consumer')}>Consumer</button>
                <button id="partnerBtn" className={`p-1 font-bold rounded-2xl ${activeForm === 'partner' ? 'bg-blue-500 text-white' : 'bg-white text-black'}`} onClick={() => switchForm('partner')}>Kadiwa Partner</button>
            </div>

            {renderForm()}

             {/* Consumer Registration Success Modal */}
             <div id="consumerSuccessModal" className="hidden fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded shadow-md">
                    <p className="text-2xl font-semibold mb-4">Consumer Account Registered</p>
                    <p className="mb-4">Your account has been successfully registered.</p>
                    <button id="consumerSuccessOkayBtn" className="bg-blue-500 text-white px-4 py-2 rounded">OKAY</button>
                </div>
            </div>

            {/* Partner Registration Success Modal */}
            <div id="partnerSuccessModal" className="hidden fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded shadow-md">
                    <p className="text-2xl font-semibold mb-4">Partner Account Registered</p>
                    <p className="mb-4">Your account has been successfully registered. Your store is pending for accreditation.</p>
                    <button id="partnerSuccessOkayBtn" className="bg-blue-500 text-white px-4 py-2 rounded">OKAY</button>
                </div>
            </div>
        </div>
    );
};

export default RegistrationPage;

