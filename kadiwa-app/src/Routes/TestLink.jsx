import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import SearchLocation from '../test/SearchLocation';
import GetDeviceID from '../test/getDeviceID';



const TestLink = () => {

  return (
    <div>
      <Routes>
        <Route path="/search-location" element={<SearchLocation />} />
        <Route path="/get-device-id" element={<GetDeviceID />} />
       
        
      </Routes>

    </div>
  );
};

export default TestLink;
