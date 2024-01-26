
import redirectToIndexIfNoConnect from '../Scripts/connections/check';
import { Route, Routes } from 'react-router-dom';
import React, { useEffect } from 'react';
import ChatPage from '../pagesConsumer/ChatPage';

const RouteLink  = () => {

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
        <Route path="chatpage/:storeID"  element={<ChatPage />} />

      </Routes>

    </div>
  );
};

export default RouteLink;
