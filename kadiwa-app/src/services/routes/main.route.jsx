import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import NavBttnAppHome from "./../../Components/NavBttnAppHome/NavBttnAppHome";
import Home from "./../../pagesConsumer/Home";
import Store from "./../../pagesConsumer/Store";
import Cart from "./../../pagesConsumer/Cart";
import Chat from "./../../pagesConsumer/Chat";
import ProductDetails from "./../../pagesConsumer/ProductInfo";
import ProfileConsumer from "./../../pagesConsumer/Profile";
import Card from "./../../pagesConsumer/Card";
import StorePage from "./../../pagesConsumer/StorePage";

import LinkedAccount from "../../pages/profile/linkedaccounts/PaymentMethods";
import redirectToIndexIfNoConnect from "./../../Scripts/connections/check";

import PickupTransaction from "./../../pagesConsumer/PickupTransaction";
import Orders from "./../../pagesConsumer/Orders";
import OrdersData from "./../../pagesConsumer/Orders/OrdersData";
import Wallet from "./../../pagesConsumer/Wallet";
import ProductsPage from "./../../pagesConsumer/Products/ProductsPage";
import SearchPage from "./../../pagesConsumer/Home/searchPage";
import ScheduledDelivery from "./../../pagesConsumer/Profile/ScheduledDelivery";
import EditPaymentMethod from "../../pages/profile/linkedaccounts/EditPaymentMethod";

const MainRoute = () => {
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
        <Route path="/" element={<Home />} />
        <Route path="store" element={<Store />} />
        <Route path="chat" element={<Chat />} />
        <Route path="cart" element={<Cart />} />
        <Route path="profile" element={<ProfileConsumer />} />
        <Route path="search" element={<SearchPage />} />
        <Route
          path="productinfo/:productCode/:category"
          element={<ProductDetails />}
        />
        <Route
          path="storepage/:storeID"
          component={StorePage}
          element={<StorePage />}
        />
        <Route path="virtual-card" element={<Card />} />
        <Route path="linked-account" element={<LinkedAccount />} />
        <Route
          path="linked-account/:paymentmethods"
          element={<EditPaymentMethod />}
        />
        <Route path="pickup/:status" element={<PickupTransaction />} />
        <Route path="orders/:tab/:getstatus" element={<Orders />} />
        <Route
          path="order-details/:tab/:status/:orderId"
          element={<OrdersData />}
        />
        <Route path="Wallet" element={<Wallet />} />
        <Route path="products-page/:category" element={<ProductsPage />} />
        <Route path="scheduled" element={<ScheduledDelivery />} />
      </Routes>
      <NavBttnAppHome />
    </div>
  );
};

export default MainRoute;
