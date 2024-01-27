import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import CropFreeIcon from '@mui/icons-material/CropFree';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const NavbttnPOS = () => {
  return (
    <footer className="p-4 text-white flex justify-around fixed bottom-0 w-full" style={{ backgroundColor: '#20802F' }}>
      {/* Home */}
      <div className="flex flex-col items-center">
        <a href="./dashboard.html">
          <HomeIcon />
        </a>
        <p variant="caption">Home</p>
      </div>

      {/* Inventory */}
      <div id="scanProductButton" className="flex flex-col items-center">
        <a>
          <CropFreeIcon />
        </a>
        <p variant="caption">Scan Product</p>
      </div>

      {/* Add Products (larger icon) */}
      <div id="addProductsButton" className="flex flex-col items-center">
        <a>
          <AddCircleIcon style={{ fontSize: 24 }} />
        </a>
        <p variant="caption">Add Products</p>
      </div>
    </footer>
  );
};

export default NavbttnPOS;
