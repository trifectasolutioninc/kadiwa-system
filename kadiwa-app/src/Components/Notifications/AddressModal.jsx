// IncompleteAddressModal.js

import React from "react";

const IncompleteAddressModal = ({ isOpen, onClose, content, openSelectedAddressModal }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto">
          <div
            className="fixed inset-0 bg-gray-700 opacity-70 blur-sm"
            onClick={onClose}
          ></div>
          <div className="relative w-full max-w-lg mx-auto my-6">
            <div className="relative mx-5 flex flex-col bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
              <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-blueGray-200">
                <h3 className="text-3xl font-semibold">{content.title}</h3>
                <button
                  className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                  onClick={onClose}
                >
                  <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                    ×
                  </span>
                </button>
              </div>
              <div className="relative p-6 flex-auto">
                <p>{content.message}</p>
              </div>
              <div className="flex items-center justify-end p-6 border-t border-solid rounded-b border-blueGray-200">
                <button
                  className="text-white bg-green-500 font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 rounded"
                  type="button"
                  onClick={openSelectedAddressModal}
                >
                  Select Address
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default IncompleteAddressModal;
