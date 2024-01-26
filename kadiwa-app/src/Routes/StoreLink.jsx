
import redirectToIndexIfNoConnect from '../Scripts/connections/check';
import NavBttnAppHome from '../Components/NavBttnAppHome/NavBttnStore';
import { Route, Routes } from 'react-router-dom';
import React, { useEffect } from 'react';
import HomePage from '../pagesPartner/Home';
import Inventory from '../pagesPartner/Inventory';
import InventoryProductList from '../pagesPartner/InventoryProductList';
import BarcodeScanner from '../pagesPartner/BarcodeScanner';

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
        <Route path="inventory"  element={<Inventory />} />
        <Route path="inventorylist"  element={<InventoryProductList />} />
        <Route path="barcodescanner"  element={<BarcodeScanner />} />

      </Routes>
      <NavBttnAppHome />
    </div>
  );
};

export default StoreLink;
