// SelectedAddressModal.js
import React, { useState } from "react";
import axios from "axios";

const SelectedAddressModal = ({
  showModal,
  closeModal,
  handleAddressSelect,
  defaultAddress,
  additionalAddresses,
  selectedAddress,
}) => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedOption, setSelectedOption] = useState("New");
  const [contactPerson, setContactPerson] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: query,
            format: "json",
            limit: 10,
          },
        }
      );

      const data = response.data;
      setSearchResults(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleMapClick = (latitude, longitude) => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
      "_blank"
    );
  };

  const handleMapClick2 = (locationName) => {
    const formattedLocationName = encodeURIComponent(locationName);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${formattedLocationName}`,
      "_blank"
    );
  };

  const handleMapClick3 = (result) => {
    console.log(result);
  };

  return (
    <div
      className={`${
        showModal ? "fixed" : "hidden"
      } z-10 inset-0 overflow-y-auto`}
    >
      {/* Modal content */}
      <div className="flex items-center justify-center min-h-screen  text-center p-4 sm:block">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden w-full shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-2">
              Address Selection
            </h3>
            <div className="flex justify-around gap-3">
              <button
                className={`p-2 ${
                  selectedOption === "New"
                    ? "bg-green-400 rounded-md"
                    : "bg-white border border-green-500 rounded-md"
                } text-sm text-gray-700`}
                onClick={() => setSelectedOption("New")}
              >
                New Address
              </button>
              <button
                className={`p-2 ${
                  selectedOption === "My"
                    ? "bg-green-400 rounded-md"
                    : "bg-white border border-green-500 rounded-md"
                } text-sm text-gray-700`}
                onClick={() => setSelectedOption("My")}
              >
                My Address
              </button>
            </div>
            {selectedOption === "New" && (
              <div className="mt-6">
                <div className="mb-4">
                  <div className=" flex justify-between my-1">
                    <p className="text-sm font-medium text-gray-700 ">
                      Input New Address
                    </p>
                    <div>
                      <button className=" p-1 bg-green-600 rounded-md text-xs font-bold text-white">
                        Get Current
                      </button>
                    </div>
                  </div>
                  <div className="text-center inline-flex w-full my-1">
                    <input
                      type="text"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      placeholder="Contact Person"
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                      maxLength={35}
                    />
                  </div>
                  <div className="text-center inline-flex w-full my-1">
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Phone Number"
                      className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                      minLength={11}
                      maxLength={13}
                    />
                  </div>

                  <div className="text-center inline-flex w-full my-1">
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search Place"
                      className="appearance-none rounded-l-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900  focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                      maxLength={100}
                    />
                    <button
                      onClick={handleSearch}
                      className=" bg-green-700 text-white rounded-r-md px-2"
                    >
                      {" "}
                      Search{" "}
                    </button>
                  </div>

                  <div className="  bg-gray-100 p-2 rounded-md max-h-40 overflow-y-auto">
                    {searchResults.map((result, index) => (
                      <div
                        key={index}
                        className="border border-gray-300 rounded-md p-4 mb-1"
                      >
                        <p className="text-[0.8em] font-semibold">
                          {result.display_name}
                        </p>
                        {/* <p><strong>Latitude:</strong> {parseFloat(result.lat).toFixed(6)}</p>
                                                <p><strong>Longitude:</strong> {parseFloat(result.lon).toFixed(6)}</p> */}
                        {/* <button
                                                    onClick={() => handleMapClick(result.lat, result.lon)}
                                                    className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                                >
                                                    (Long & Lat) Google Maps
                                                </button> */}
                        <div className=" flex justify-end space-x-1">
                          <button
                            onClick={() => handleMapClick2(result.display_name)}
                            className="mt-2 bg-blue-500 text-[0.8em] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                          >
                            View Google Maps
                          </button>
                          <button
                            onClick={() =>
                              handleAddressSelect(
                                result,
                                contactPerson,
                                phoneNumber
                              )
                            }
                            className="mt-2 border text-[0.8em] border-green-700 font-bold text-green-700  py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                          >
                            {" "}
                            SELECT{" "}
                          </button>
                        </div>

                        {/* <button  onClick={() => handleMapClick3(result)} className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                                    GET
                                                </button> */}
                      </div>
                    ))}
                  </div>
                </div>
                {/* <div className=' flex items-center text-xs gap-3'>
                                <div className=' h-[0.1em] w-full bg-gray-300'></div>
                                <span>or</span>
                                <div className=' h-[0.1em] w-full bg-gray-300'></div>
                            </div> */}
              </div>
            )}
            {selectedOption === "My" && (
              <div>
                {/* {selectedAddress && ( // Conditionally render the selected address
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700">Selected Address</p>
                  <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                    <p>{selectedAddress?.person || 'N/A'} | {selectedAddress?.contact || 'N/A'}</p>
                    <button className="text-blue-400" onClick={() => handleAddressSelect(selectedAddress)}>Select</button>
                  </div>
                </div>
              )} */}
                {defaultAddress && ( // Conditionally render the selected address
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700">
                      Default Address
                    </p>
                    <div className="flex items-center justify-between bg-gray-100 p-2 rounded-md">
                      <p>
                        {defaultAddress?.default.person || "N/A"} |{" "}
                        {defaultAddress?.default.contact || "N/A"}
                      </p>
                      <button
                        className="text-blue-400"
                        onClick={() =>
                          handleAddressSelect(defaultAddress.default)
                        }
                      >
                        Select
                      </button>
                    </div>
                  </div>
                )}
                {additionalAddresses && additionalAddresses.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700">
                      Additional Addresses
                    </p>
                    {additionalAddresses.map((address, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-100 p-2 rounded-md"
                      >
                        <p>
                          {address?.person || "N/A"} |{" "}
                          {address?.contact || "N/A"}
                        </p>
                        <button
                          className="text-blue-400"
                          onClick={() => handleAddressSelect(address)}
                        >
                          Select
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
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
