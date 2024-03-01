import React, { useEffect, useState } from "react";
import { ref, get, update } from "firebase/database";
import firebaseDB from "../../Configuration/config";

const AddAddressModal = ({ showModal, closeModal, handleAddAddress }) => {
  const [address, setAddress] = useState({
    barangay: "",
    city: "",
    contact: "",
    landmark: "",
    person: "",
    province: "",
    region: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddAddress(address);
    setAddress({
      barangay: "",
      city: "",
      contact: "",
      landmark: "",
      person: "",
      province: "",
      region: "",
    });
    closeModal();
  };

  return (
    <div
      className={`${
        showModal ? "fixed" : "hidden"
      } z-10 inset-0 overflow-y-auto`}
    >
      <div className="flex items-center justify-center min-h-screen p-4 text-center sm:block ">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden w-3/4 shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Add Additional Address
              </h3>
              <div className="mt-6">
                <div className="mb-4">
                  <label
                    htmlFor="person"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Person Name
                  </label>
                  <input
                    type="text"
                    name="person"
                    id="person"
                    value={address.person}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                    placeholder="Enter Name (limit: 35 character"
                    maxLength={35}
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="contact"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Contact
                  </label>
                  <input
                    type="tel"
                    name="contact"
                    id="contact"
                    value={address.contact}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                    placeholder="Enter phone number (09...)"
                    minLength={11}
                    maxLength={13}
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="region"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Region
                  </label>
                  <input
                    type="text"
                    name="region"
                    id="region"
                    value={address.region}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                    maxLength={50}
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="province"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Province
                  </label>
                  <input
                    type="text"
                    name="province"
                    id="province"
                    value={address.province}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                    maxLength={50}
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="city"
                    className="block text-sm font-medium text-gray-700"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    id="city"
                    value={address.city}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                    maxLength={50}
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="barangay"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Barangay
                  </label>
                  <input
                    type="text"
                    name="barangay"
                    id="barangay"
                    value={address.barangay}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                    maxLength={50}
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="barangay"
                    className="block text-sm font-medium text-gray-700"
                  >
                    House Number
                  </label>
                  <input
                    type="text"
                    name="houseNumber"
                    id="houseNumber"
                    value=""
                    onChange=""
                    className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                    maxLength={50}
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="landmark"
                    className="block text-sm font-medium text-gray-700"
                  >
                    landmark
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    id="landmark"
                    value={address.landmark}
                    onChange={handleChange}
                    className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    maxLength={50}
                  />
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Add Address
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddAddressModal;
