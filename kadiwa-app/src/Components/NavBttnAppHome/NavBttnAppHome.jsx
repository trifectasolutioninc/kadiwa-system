import React from "react";
import {
  Home,
  Store,
  Chat,
  ShoppingCart,
  AccountCircle,
} from "@mui/icons-material";
import { NavLink } from "react-router-dom";

const NavBttnAppHome = () => {
  return (
    <React.Fragment>
      <footer
        className="p-4 text-white flex items-center  justify-around fixed bottom-0 w-full"
        style={{ backgroundColor: "#20802F" }}
      >
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
          className="text-white text-xs flex flex-col items-centere"
        >
          <Chat />
          Chat
        </NavLink>
        <NavLink
          to="cart"
          className="text-white text-xs flex flex-col items-center"
        >
          <ShoppingCart />
          Cart
        </NavLink>
        <NavLink
          to="profile"
          className="text-white text-xs flex flex-col items-center"
        >
          <AccountCircle />
          Account
        </NavLink>
      </footer>
    </React.Fragment>
  );
};

export default NavBttnAppHome;
