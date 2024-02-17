// SelectedAddressModal.js
import React from 'react';

const SelectedAddressModal = ({ showModal, closeModal, handleAddressSelect, defaultAddress, additionalAddresses, selectedAddress }) => {
  return (
    <div className={`${showModal ? 'fixed' : 'hidden'} z-10 inset-0 overflow-y-auto`}>
      {/* Modal content */}
      <div className="flex items-center justify-center min-h-screen p-4 text-center sm:block">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden w-3/4 shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Select Address</h3>
            <div className="mt-6">
              {selectedAddress && ( // Conditionally render the selected address
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700">Selected Address</p>
                  <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                    <p>{selectedAddress?.person || 'N/A'} | {selectedAddress?.contact || 'N/A'}</p>
                    <button className="text-blue-400" onClick={() => handleAddressSelect(selectedAddress)}>Select</button>
                  </div>
                </div>
              )}
              {defaultAddress && ( // Conditionally render the selected address
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700">Default Address</p>
                  <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                    <p>{defaultAddress?.default.person || 'N/A'} | {defaultAddress?.default.contact || 'N/A'}</p>
                    <button className="text-blue-400" onClick={() => handleAddressSelect(defaultAddress.default)}>Select</button>
                  </div>
                </div>
              )}
              {additionalAddresses && additionalAddresses.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700">Additional Addresses</p>
                  {additionalAddresses.map((address, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                      <p>{address?.person || 'N/A'} | {address?.contact || 'N/A'}</p>
                      <button className="text-blue-400" onClick={() => handleAddressSelect(address)}>Select</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={closeModal}
              className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectedAddressModal;
