import React, { useState, useEffect } from "react";
import {
  Home,
  Store,
  Chat,
  ShoppingCart,
  AccountCircle,
} from "@mui/icons-material";
import { NavLink } from "react-router-dom";
import { getDatabase, ref, get, onValue, off } from "firebase/database";

const NavBttnAppHome = () => {
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const uid = sessionStorage.getItem("uid"); // Assuming you have the user's ID stored in sessionStorage

  useEffect(() => {
    const database = getDatabase();
    const ordersRef = ref(database, "orders_list");
    const cartsRef = ref(database, "cart_collection");
    const chatRef = ref(database, `chat_collections`);

    const fetchPendingOrdersCount = async () => {
      try {
        // Fetch initial pending orders count
        let count = 0;
        const ordersSnapshot = await get(ordersRef);
        ordersSnapshot.forEach((order) => {
          const orderData = order.val();
          if (orderData.consumer === uid && orderData.status === "Pending") {
            count++;
          }
        });
        setPendingOrdersCount(count);

        // Fetch initial cart count
        let cart = 0;
        const cartsSnapshot = await get(cartsRef);
        cartsSnapshot.forEach((cartlist) => {
          const cartData = cartlist.val();
          if (cartData.consumer_id === uid && cartData.CartList) {
            const cartItems = cartData.CartList;
            const itemCount = Object.keys(cartItems).length;
            cart += itemCount;
          }
        });
        setCartCount(cart);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    const fetchUnreadMessagesCount = async () => {
      try {
        let unreadCount = 0;
        const chatSnapshot = await get(chatRef);
        chatSnapshot.forEach((chat) => {
          const chatData = chat.val();
          // Check if the consumer is equal to uid
          if (chatData.consumer === uid) {
            // Iterate through messages and count unread messages from bot and partner
            Object.values(chatData.Chat).forEach((message) => {
              if (
                (message.sender === "bot" || message.sender === "partner") &&
                message.status === "unread"
              ) {
                unreadCount++;
              }
            });
          }
        });
        setUnreadMessagesCount(unreadCount);
      } catch (error) {
        console.error("Error fetching unread messages count:", error);
      }
    };

    fetchPendingOrdersCount();
    fetchUnreadMessagesCount();

    // Set up real-time listeners
    const ordersListener = onValue(ordersRef, () => {
      fetchPendingOrdersCount();
    });

    const cartsListener = onValue(cartsRef, () => {
      fetchPendingOrdersCount();
    });

    const chatListener = onValue(chatRef, () => {
      fetchUnreadMessagesCount();
    });

    // Clean up listeners
    return () => {
      off(ordersRef, "value", ordersListener);
      off(cartsRef, "value", cartsListener);
      off(chatRef, "value", chatListener);
    };
  }, [uid]);

  return (
    <React.Fragment>
      <div className="p-3 bg-neutral-100 fixed bottom-0 w-full"></div>
      <footer className="p-4 bg-green-700 text-white flex items-center justify-around fixed bottom-1 right-1 left-1 rounded-md z-50">
        <NavLink
          to=""
          className="text-white text-xs flex flex-col items-center"
        >
          <Home />
          Home
        </NavLink>
        <NavLink
          to="store"
          className="text-white text-xs flex flex-col items-center"
        >
          <Store />
          Stores
        </NavLink>
        <NavLink
          to="chat"
          className="text-white text-xs flex flex-col items-center relative"
        >
          <Chat />
          Chat
          {unreadMessagesCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-700 text-white px-2 py-1 rounded-full text-[0.8em]">
              {unreadMessagesCount}
            </span>
          )}
        </NavLink>
        <NavLink
          to="cart"
          className="text-white text-xs flex flex-col items-center relative"
        >
          <ShoppingCart />
          Cart
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-700 text-white px-2 py-1 rounded-full text-[0.8em]">
              {cartCount}
            </span>
          )}
        </NavLink>
        <NavLink
          to="profile"
          className="text-white text-xs flex flex-col items-center relative"
        >
          <AccountCircle />
          Account
          {pendingOrdersCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-700 text-white px-2 py-1 rounded-full text-[0.8em]">
              {pendingOrdersCount}
            </span>
          )}
        </NavLink>
      </footer>
    </React.Fragment>
  );
};

export default NavBttnAppHome;
