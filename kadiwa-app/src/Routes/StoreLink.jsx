
import redirectToIndexIfNoConnect from '../Scripts/connections/check';
import NavBttnAppHome from '../Components/NavBttnAppHome/NavBttnStore';
import { Route, Routes } from 'react-router-dom';
import React, { useEffect } from 'react';
import HomePage from '../pagesPartner/Home';

const StoreLink  = () => {

    useEffect(() => {
        // Use the utility function
        const isValidContact = redirectToIndexIfNoConnect();

        // Additional logic based on the result if needed
        if (!isValidContact) {
            // Handle redirection or other actions
        }
        }, []);

  return (
    <div>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="home"  element={<HomePage />} />

      </Routes>
      <NavBttnAppHome />
    </div>
  );
};

export default StoreLink;
