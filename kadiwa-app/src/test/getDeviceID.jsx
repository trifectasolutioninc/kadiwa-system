import React, { useState, useEffect } from 'react';
const deviceDetect = require('device-detect')();

const GetDeviceID = () => {
  const [deviceID, setDeviceID] = useState(null);
  const [deviceType, setDeviceType] = useState(null);
  const [deviceBrand, setDeviceBrand] = useState(null);
  const [deviceBrowser, setDeviceBrowser] = useState(null);

  useEffect(() => {
    // Function to fetch or generate device ID
    const fetchDeviceID = () => {
      // Simulating fetching device ID (e.g., from localStorage)
      let id = localStorage.getItem('deviceID');
      if (!id) {
        id = Math.random().toString(36).substring(7);
        localStorage.setItem('deviceID', id);
      }
      setDeviceID(id);
    };

    // Function to determine device type, brand, and browser
    const determineDeviceInfo = () => {
      setDeviceType(deviceDetect.device || 'Unknown');
      setDeviceBrand(deviceDetect.device || 'Unknown');
      setDeviceBrowser(deviceDetect.browser || 'Unknown');
    };

    fetchDeviceID();
    determineDeviceInfo();

    // Cleanup function if needed
    return () => {
      // Any cleanup code
    };
  }, []); // Empty dependency array means it runs only once on component mount

  return (
    <div>
      <p>Device ID: {deviceID}</p>
      <p>Device Type: {deviceType}</p>
      <p>Device Brand: {deviceBrand}</p>
      <p>Device Browser: {deviceBrowser}</p>
    </div>
  );
};

export default GetDeviceID;
