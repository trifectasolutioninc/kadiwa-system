
import { Route, Routes } from 'react-router-dom';
import React, { useEffect } from 'react';
import Terms_and_Conditions from './../../pages/informations/Terms_and_Conditions';
import PrivacyPolicy from './../../pages/informations/Privacy_Policy';
import redirectToIndexIfNoConnect from './../../Scripts/connections/check';



const InfoRoute  = () => {

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
        <Route path="/terms-and-conditions" element={<Terms_and_Conditions />} /> 
        <Route path="/privacy-policy" element={<PrivacyPolicy />} /> 
       
      </Routes>
    </div>
  );
};

export default InfoRoute;