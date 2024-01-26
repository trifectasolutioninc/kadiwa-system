import React, { useState, useEffect } from 'react';
import { ref, child, update } from 'firebase/database';
import configFirebaseDB from '../Configuration/config';

const ProfileEdit = () => {
    const [formData, setFormData] = useState({
      fullname: '',
      birthday: '',
      gender: '',
      region: '',
      province: '',
      city: '',
      barangay: '',
      landmark: '',
      contact: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  
    useEffect(() => {
      // Fetch user data and populate the form fields if needed
      // Use the same logic you used in ProfileInfo to retrieve user data
    }, []);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    };
  
    const handleSaveChanges = async () => {
      try {
        // Update the user's data in Firebase
        const database = configFirebaseDB();
        const getcontact = sessionStorage.getItem('contact');
        const usersAccountRef = ref(database, 'kadiwa_users_account', getcontact);
  
        await update(child(usersAccountRef, formData));
  
        // Show success modal or perform any other action
      } catch (error) {
        console.error('Error updating user data:', error);
        // Handle error
      }
    };

  return (
    <div>
      {/* Header */}
      <header className="p-4 bg-gray-100">
        <h1 className="text-2xl font-bold">Account Management</h1>
      </header>
  
      {/* Edit Profile Form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        <div>
          <h2 className="font-bold text-gray-600">Profile Info</h2>
          <div className="h-0.5 bg-gray-300"></div>
          {/* Editable fields go here */}
          <div className="mb-4">
            <label htmlFor="fullname" className="block text-gray-700 font-semibold text-xs mb-2">Full Name:</label>
            <input type="text" id="fullname" name="fullname" value={formData.fullname} onChange={handleChange} className="w-full border p-2 rounded-md" />
          </div>
  
          <div className="mb-4">
            <label htmlFor="birthday" className="block text-gray-700 font-semibold text-xs mb-2">Birthday:</label>
            <input type="date" id="birthday" name="birthday" value={formData.birthday} onChange={handleChange} className="w-full border p-2 rounded-md" />
          </div>
  
          <div className="mb-4">
            <label htmlFor="gender" className="block text-gray-700 font-semibold text-xs mb-2">Gender:</label>
            <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className="w-full border p-2 rounded-md">
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          {/* Input for specifying gender when "Other" is selected */}
          <div id="otherGenderInput" className={formData.gender === 'other' ? 'mb-4' : 'mb-4 hidden'}>
            <label htmlFor="otherGender" className="block text-gray-700 font-semibold text-xs mb-2">Specify Gender:</label>
            <input type="text" id="otherGender" name="otherGender" value={formData.otherGender} onChange={handleChange} className="w-full border p-2 rounded-md" />
          </div>
        </div>
  
        <div>
          <div className="justify-between flex">
            <h2 className="font-bold text-gray-600 inline-block">Permanent Address</h2>
            <button id="editAddress" className="ml-2 text-gray-500 cursor-pointer">
              <span className="material-icons">edit</span>
            </button>
          </div>
          <div className="h-0.5 bg-gray-300"></div>
  
          {/* ... (rest of the address form fields) */}
          <div className="mb-4">
            <label htmlFor="landmark" className="block text-gray-700 font-semibold text-xs mb-2">Store Landmark (Optional)</label>
            <input type="text" id="landmark" name="landmark" placeholder="Build No/Street/Other" value={formData.landmark} onChange={handleChange} className="w-full p-2 border rounded-md" />
          </div>
        </div>
  
        <div>
          <h2 className="font-bold text-gray-600">Contact Info</h2>
          <div className="h-0.5 bg-gray-300"></div>
          <div className="mb-4">
            <label htmlFor="contact" className="block text-gray-700 font-semibold text-xs mb-2">Contact:</label>
            <input type="tel" id="contact" name="contact" value={formData.contact} onChange={handleChange} className="w-full border p-2 rounded-md" />
          </div>
  
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-semibold text-xs mb-2">Email:</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full border p-2 rounded-md" />
          </div>
        </div>
  
        <div>
          <h2 className="font-bold text-gray-600">Change Password</h2>
          <div className="h-0.5 bg-gray-300"></div>
          <div className="mb-4">
            <label htmlFor="partnerPassword" className="block text-gray-700 font-semibold text-xs mb-2">Password</label>
            <input type="password" id="partnerPassword" name="partnerPassword" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full p-2 border rounded-md" required />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPartnerPassword" className="block text-gray-700 font-semibold text-xs mb-2">Confirm Password</label>
            <input type="password" id="confirmPartnerPassword" name="confirmPartnerPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} className="w-full p-2 border rounded-md" required />
          </div>
        </div>
  
        {/* ... (rest of your components) */}
      </div>
  
      {/* Modal Structure */}
      <div id="SuccessModal" className="modal hidden fixed inset-0 bg-gray-500 bg-opacity-75 items-center justify-center">
        <div className="modal-content bg-white p-8 rounded-md">
          <h2 className="text-2xl font-bold mb-4 text-green-500">Update Successful</h2>
          <p>Your data has been successfully updated.</p>
          <button
            id="closeSuccessModal"
            className="bg-blue-500 text-white py-2 px-4 rounded-md mt-4"
            onClick={() => {
              // Close the modal and perform any other actions
            }}
          >
            Close
          </button>
        </div>
      </div>

    </div>

  );
};

export default ProfileEdit;
