import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import SearchLocation from '../test/SearchLocation';



const TestLink = () => {

  return (
    <div>
      <Routes>
        <Route path="/search-location" element={<SearchLocation />} />
       
        
      </Routes>

    </div>
  );
};

export default TestLink;
