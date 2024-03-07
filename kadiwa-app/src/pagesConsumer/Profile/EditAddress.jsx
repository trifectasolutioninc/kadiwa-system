import React, { useEffect, useState } from "react";
import { ref, get, update } from "firebase/database";
import firebaseDB from "../../Configuration/config";

const EditAddress = ({ addressType, closeModal }) => {
  const [addressData, setAddressData] = useState({
    barangay: "",
    city: "",
    contact: "",
    landmark: "",
    person: "",
    province: "",
    region: "",
    homeno: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const database = firebaseDB();
        const uid = sessionStorage.getItem("uid");
        const addressRef = ref(database, `users_address/${uid}/${addressType}`);

        const snapshot = await get(addressRef);
        const addressDataFromFirebase = snapshot.val();

        if (addressDataFromFirebase) {
          setAddressData(addressDataFromFirebase);
        }
      } catch (error) {
        console.error("Error fetching address data:", error);
      }
    };

    fetchData();
  }, [addressType]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddressData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const database = firebaseDB();
      const uid = sessionStorage.getItem("uid");
      const addressRef = ref(database, `users_address/${uid}/${addressType}`);

      await update(addressRef, addressData);
      alert("Address updated successfully!");
      closeModal();
    } catch (error) {
      console.error("Error updating address:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-md w-3/4">
        <h2 className="text-xl font-bold mb-4">
          {addressType === "default"
            ? "Edit Default Address"
            : "Edit Additional Address"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <h1 className="text-sm font-bold">Contact</h1>
          <div className="flex flex-col">
            <label htmlFor="person" className="font-semibold text-xs">
              Full Name:
            </label>
            <input
              type="text"
              id="person"
              name="person"
              placeholder="Full Name"
              value={addressData.person}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="contact" className="font-semibold text-xs">
              Phone Number:
            </label>
            <input
              type="text"
              id="contact"
              name="contact"
              placeholder="Phone Number"
              value={addressData.contact}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <h1 className="text-sm font-bold">Address</h1>
          <div className="flex flex-col">
            <label htmlFor="region" className="font-semibold text-xs">
              Region:
            </label>
            <input
              type="text"
              id="region"
              name="region"
              value={addressData.region}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="province" className="font-semibold text-xs">
              Province:
            </label>
            <input
              type="text"
              id="province"
              name="province"
              value={addressData.province}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="city" className="font-semibold text-xs">
              City:
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={addressData.city}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="barangay" className="font-semibold text-xs">
              Barangay:
            </label>
            <input
              type="text"
              id="barangay"
              name="barangay"
              value={addressData.barangay}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="barangay" className="font-semibold text-xs">
              House Number:
            </label>
            <input
              type="text"
              id="houseNumber"
              name="houseNumber"
              value={addressData.homeno}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="landmark" className="font-semibold text-xs">
              Landmark:
            </label>
            <input
              type="text"
              id="landmark"
              name="landmark"
              value={addressData.landmark}
              onChange={handleInputChange}
              className="border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={closeModal}
              className="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-md mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAddress;
