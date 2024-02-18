import React, { useState, useEffect } from "react";
import { Home, Store, Chat, ShoppingCart, AccountCircle } from "@mui/icons-material";
import { NavLink } from "react-router-dom";
import { getDatabase, ref, get, onValue, off } from 'firebase/database';

const NavBttnAppHome = () => {
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const uid = sessionStorage.getItem("uid"); // Assuming you have the user's ID stored in sessionStorage

  useEffect(() => {
    const database = getDatabase();
    const ordersRef = ref(database, 'orders_list');
    const cartsRef = ref(database, 'cart_collection');
  
    const fetchPendingOrdersCount = async () => {
      try {
        // Fetch initial pending orders count
        let count = 0;
        const ordersSnapshot = await get(ordersRef);
        ordersSnapshot.forEach((order) => {
          const orderData = order.val();
          if (orderData.consumer === uid && orderData.status === 'Pending') {
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
        console.error('Error fetching initial data:', error);
      }
    };
  
    fetchPendingOrdersCount();
  
    // Set up real-time listeners
    const ordersListener = onValue(ordersRef, (snapshot) => {
      fetchPendingOrdersCount();
    });
  
    const cartsListener = onValue(cartsRef, (snapshot) => {
      fetchPendingOrdersCount();
    });
  
    // Clean up listeners
    return () => {
      off(ordersRef, 'value', ordersListener);
      off(cartsRef, 'value', cartsListener);
    };
  
  }, [uid]);
  
  
  

  return (
    <React.Fragment>
      <footer className="p-4 text-white flex items-center justify-around fixed bottom-0 w-full z-50" style={{ backgroundColor: "#20802F" }}>
        <NavLink to="" className="text-white text-xs flex flex-col items-center">
          <Home />
          Home
        </NavLink>
        <NavLink to="store" className="text-white text-xs flex flex-col items-center">
          <Store />
          Stores
        </NavLink>
        <NavLink to="chat" className="text-white text-xs flex flex-col items-center">
          <Chat />
          Chat
        </NavLink>
        <NavLink to="cart" className="text-white text-xs flex flex-col items-center relative">
          <ShoppingCart />
          Cart
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-700 text-white px-2 py-1 rounded-full text-[0.8em]">{cartCount}</span>
          )}
        </NavLink>
        <NavLink to="profile" className="text-white text-xs flex flex-col items-center relative">
          <AccountCircle />
          Account
          {pendingOrdersCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-700 text-white px-2 py-1 rounded-full text-[0.8em]">{pendingOrdersCount}</span>
          )}
        </NavLink>
      </footer>
    </React.Fragment>
  );
};

export default NavBttnAppHome;
