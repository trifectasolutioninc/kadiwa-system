
import redirectToIndexIfNoConnect from '../Scripts/connections/check';
import { Route, Routes } from 'react-router-dom';
import React, { useEffect } from 'react';
import NavbttnPOS from '../Components/NavBttnAppHome/NavbttnPOS';
import POS from '../pagesPartner/POS';


const POSLink  = () => {

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

        <Route path="home"  element={<POS />} />
      
      </Routes>
      <NavbttnPOS />
    </div>
  );
};

export default POSLink;
