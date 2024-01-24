import React from 'react';

const CartItem = ({ id, name, price, quantity, imgAlt, isChecked, onCheckboxChange }) => (
    <div className="items-center border-b py-2 grid grid-cols-10">
      <div className="flex items-center mr-4 col-span-3">
        <input
          type="checkbox"
          className="mr-2"
          checked={isChecked}
          onChange={onCheckboxChange}
        />
      <img
        id={`cart${id}`}
        src={imgAlt} // Replace with the actual path to your images
        alt={imgAlt}
        className="w-12 h-12 object-cover rounded"
      />
    </div>
    <div className="text-left col-span-7">
      <h1 className="text-gray-800 font-semibold">{name}</h1>
      <div className=" justify-between flex items-center">
        <p className="font-semibold text-green-700 text-lg ">{`Php ${price.toFixed(2)}`}</p>
        <div className="flex items-center ">
          <span className="text-xs pr-2 font-bold text-gray-500">Qty:</span>
          <div className="flex items-center">
            <button className="text-sm px-2 border rounded" onClick={() => console.log('Decrement clicked')}>-</button>
            <input
              type="number"
              value={quantity}
              className="w-12 h-8 text-center border rounded-md text-xs"
              readOnly
            />
            <button className="text-sm px-2 border rounded" onClick={() => console.log('Increment clicked')}>+</button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default CartItem;
