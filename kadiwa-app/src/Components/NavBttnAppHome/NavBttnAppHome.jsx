import React from 'react';
import { Home, Store, Chat, ShoppingCart, AccountCircle } from '@mui/icons-material';
import { NavLink } from 'react-router-dom';

const NavBttnAppHome = () => {
  return (
    <React.Fragment>
      <footer className="p-4 text-white flex justify-around fixed bottom-0 w-full" style={{ backgroundColor: '#20802F' }}>
        <NavLink to="" className="text-white">
          <Home />
        </NavLink>
        <NavLink to="store" className="text-white"><Store /></NavLink>
        <NavLink to="chat" className="text-white"><Chat /></NavLink>
        <NavLink to="cart" className="text-white"><ShoppingCart /></NavLink>
        <NavLink to="profile" className="text-white"><AccountCircle /></NavLink>
      </footer>
    </React.Fragment>
  );
};

export default NavBttnAppHome;
