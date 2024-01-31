import redirectToIndexIfNoConnect from '../Scripts/connections/check';
import { Route, Routes } from 'react-router-dom';
import React, { useEffect } from 'react';
import ChatPage from '../pagesConsumer/ChatPage';
import ProfileInfo from '../pagesConsumer/ProfileInfo';
import ProfileEdit from '../pagesConsumer/ProfileEdit';
import DeliveryPage from '../pagesConsumer/Delivery';
import PickupPage from '../pagesConsumer/Pickup';
import StoreProductDetails from '../pagesConsumer/StoreProductPageInfo';

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
        <Route path="profileinfo"  element={<ProfileInfo />} />
        <Route path="profileedit"  element={<ProfileEdit />} />
        <Route path="delivery"  element={<DeliveryPage />} />
        <Route path="pickup"  element={<PickupPage />} />
        <Route path="product/:productCode" element={<StoreProductDetails />} />

      </Routes>
    </div>
  );
};

export default RouteLink;