import redirectToIndexIfNoConnect from '../Scripts/connections/check';
import { Route, Routes } from 'react-router-dom';
import React, { useEffect } from 'react';
import ChatPage from '../pagesConsumer/ChatPage';
import ProfileInfo from '../pagesConsumer/ProfileInfo';
import ProfileEdit from '../pagesConsumer/ProfileEdit';
import DeliveryPage from '../pagesConsumer/Delivery';
import PickupPage from '../pagesConsumer/Pickup';
import StoreProductDetails from '../pagesConsumer/StoreProductPageInfo';
import InboxPage from '../pagesPartner/InboxPage';
import Payment from '../pagesPartner/Payment';
import Checkout from '../pagesConsumer/Checkout';
import PersonalInfoPage from '../pagesConsumer/Profile/Account_Management/PersonalInfoPage';



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
        <Route path="chatpage/:storeID/:page"  element={<ChatPage />} />
        <Route path="profileinfo"  element={<ProfileInfo />} />
        <Route path="profileedit"  element={<ProfileEdit />} />
        <Route path="delivery"  element={<DeliveryPage />} />
        <Route path="pickup"  element={<PickupPage />} />
        <Route path="product/:productCode" element={<StoreProductDetails />} />
        <Route path="inboxpage/:storeID/:consumerName/:consumerID"  element={<InboxPage />} />
        <Route path="payment/:userId/:receiptNo"  element={<Payment />} />
        <Route path="checkout"  element={<Checkout />} />
        <Route path="personal-info"  element={<PersonalInfoPage />} />
      </Routes>
    </div>
  );
};

export default RouteLink;