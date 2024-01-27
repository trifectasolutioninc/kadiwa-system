import React from 'react';

const POS = () => {
  return (
    <div>
      <div className="text-center py-4">
        <span className="text-green-700 font-bold text-lg">POS</span>
      </div>
      <div className="h-0.5 bg-green-500"></div>
      <div className="bg-green-500 justify-around m-2 rounded-2xl p-1 flex">
        <button id="reviewButton" className="bg-white p-1 rounded-xl text-green-600 text-sm">REVIEW</button>
        <div className="text-center">
          <p className="text-xs text-white">Total Amount</p>
          <p id="total-amount" className="text-sm font-semibold text-white">0.00</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-white">Product QTY.</p>
          <p id="product-qty" className="text-sm font-semibold text-white">0</p>
        </div>
      </div>
      {/* Add the rest of your POS content here */}
    </div>
  );
};

export default POS;
