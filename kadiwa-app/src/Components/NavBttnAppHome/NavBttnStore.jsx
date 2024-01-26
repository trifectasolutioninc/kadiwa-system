import React from 'react';
import { Home, Store, Chat, ShoppingCart, AccountCircle, Inventory, AddCircle, LocalMall } from '@mui/icons-material';
import { NavLink } from 'react-router-dom';

const NavBttnAppHome = () => {
  return (
    <React.Fragment>
      <footer className="p-4 text-white flex justify-around fixed bottom-0 w-full" style={{ backgroundColor: '#20802F' }}>
      {/* Home */}
      <div className="flex flex-col items-center">
        <NavLink to="/partner/home" className="text-white">
          <Home />
        </NavLink>
        <span className="text-xs">Home</span>
      </div>

      {/* Inventory */}
      <div className="flex flex-col items-center">
        <NavLink to="/partner/inventory" className="text-white">
          <Inventory />
        </NavLink>
        <span className="text-xs">Inventory</span>
      </div>

      {/* Add Products (larger icon) */}
      <div className="flex flex-col items-center">
        <NavLink to="/partner/addproduct" className="text-white">
          <AddCircle style={{ fontSize: 24 }} />
        </NavLink>
        <span className="text-xs">Add Products</span>
      </div>

      {/* Products */}
      <div className="flex flex-col items-center">
        <NavLink to="/partner/products" className="text-white">
          <LocalMall />
        </NavLink>
        <span className="text-xs">Products</span>
      </div>

      {/* Store */}
      <div className="flex flex-col items-center">
        <NavLink to="/partner/store" className="text-white">
          <Store />
        </NavLink>
        <span className="text-xs">Store</span>
      </div>
    </footer>
    </React.Fragment>
  );
};

export default NavBttnAppHome;
