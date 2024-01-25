import React, { useState } from 'react';
import { imageConfig } from '../Configuration/config-file';
import { Link, NavLink, useHistory } from 'react-router-dom';

const RegistrationPage = () => {
    const [activeForm, setActiveForm] = useState('consumer');

    const switchForm = (formType) => {
        setActiveForm(formType);
    };

    const renderForm = () => {
        switch (activeForm) {
            case 'consumer':
                return (
                  <div id="consumerForm" className="mt-8 p-8 rounded">
                  <form action="#" className="space-y-4">
                      <div className="space-y-2 text-left">
                          <label  className="text-sm text-white">Phone Number</label>
                          <input type="tel" id="phoneno" name="phoneno" placeholder="Phone Number" className="w-full p-2 border rounded-md" required/>
                      </div>
                      <div className="space-y-2 text-left">
                          <label className="text-sm text-white">Password</label>
                          <input type="password" id="password" name="password" placeholder="Password" className="w-full p-2 border rounded-md" required/>
                      </div>
                      <div className="space-y-2 text-left">
                          <label  className="text-sm text-white">Confirm Password</label>
                          <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm Password" className="w-full p-2 border rounded-md" required/>
                      </div>
                      <div className="items-center">
                          <button type="submit" id="consumerSubmit" className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:border-green-300">
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
                  <div id="partnerForm" className=" mt-8 p-8 rounded overflow-auto">
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
                          <label htmlFor="region" className="text-sm text-white">Region</label>
                          <select id="region" name="region" className="w-full p-2 border rounded-md" required>
      
                          </select>
                          <input type="hidden" name="region_text" id="region-text"/>
                      </div>

                      <div className="space-y-2 text-left">
                          <label htmlFor="province" className="text-sm text-white">Province</label>
                          <select id="province" name="province" className="w-full p-2 border rounded-md" required>
      
                          </select>
                          <input type="hidden" name="province_text" id="province-text"/>
                      </div>

                      <div className="space-y-2 text-left">
                          <label htmlFor="city" className="text-sm text-white">Municipality/City</label>
                          <select id="city" name="city" className="w-full p-2 border rounded-md" required>
     
                          </select>
                          <input type="hidden" name="city_text" id="city-text"/>
                      </div>

                      <div className="space-y-2 text-left">
                          <label htmlFor="barangay" className="text-sm text-white">Barangay</label>
                          <select id="barangay" name="barangay" className="w-full p-2 border rounded-md" required>
         
                          </select>
                          <input type="hidden" name="barangay_text" id="barangay-text"/>
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
                          <button type="submit" id="partnerSubmit" className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:border-green-300">
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

