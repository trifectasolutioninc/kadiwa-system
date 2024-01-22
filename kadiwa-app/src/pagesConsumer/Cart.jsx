import React from 'react'


const CartItem = ({ id, name, price, quantity, imgAlt }) => (
  <div className="items-center border-b py-2 grid grid-cols-10">
    <div className="flex items-center mr-4 col-span-3">
      <input type="checkbox" className="mr-2" />
      <img
        id={`cart${id}`}
        src={`path/to/${imgAlt}.jpg`} // Replace with the actual path to your images
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
            <button className="text-sm px-2 border rounded " onClick={() => console.log('Decrement clicked')}>-</button>
            <input
              type="number"
              value={quantity}
              className="w-12 h-8 text-center border rounded-md"
              readOnly
            />
            <button className="text-sm px-2 border rounded" onClick={() => console.log('Increment clicked')}>+</button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Cart = () => {
  return (
     <div>
    <div className="p-4 flex justify-between">
      <h1 className="font-bold text-lg">Cart (3)</h1>
      <div>
        <span className="text-xs text-gray-500 mr-2">Edit</span>
        <span className="text-xs text-gray-500">Delete</span>
      </div>
    </div>

    <div className="mb-16">
      <div className="bg-white rounded shadow-md m-4 p-2">
        <div className="flex justify-between">
          <div className="flex">
            <input type="checkbox" className="mr-1" />
            <p className="text-sm">Sari-sari Store</p>
          </div>
          <span className="text-xs text-gray-400">Visit Store</span>
        </div>

        {/* Cart Items */}
        <CartItem id={1} name="Brown and Washed Sugar" price={20.0} quantity={1} imgAlt="Cart 1" />
        <CartItem id={2} name="Red Onion" price={30.0} quantity={1} imgAlt="Cart 2" />

        {/* Add more cart items as needed */}
      </div>
    </div>
  </div>
  )
}

export default Cart
