import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import NavBttnAppHome from '../Components/NavBttnAppHome/NavBttnAppHome';
import Home from './Home'; 
import Store from './Store'; 
import ProfileConsumer from './Profile'; 
import redirectToIndexIfNoContact from '../Scripts/connections/check';

const ConsumerMain = () => {

    useEffect(() => {
        // Use the utility function
        const isValidContact = redirectToIndexIfNoContact();

        // Additional logic based on the result if needed
        if (!isValidContact) {
            // Handle redirection or other actions
        }
        }, []);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="store" element={<Store />} />
        <Route path="profile" element={<ProfileConsumer />} />
      </Routes>
      <NavBttnAppHome />
    </div>
  );
};

export default ConsumerMain;
