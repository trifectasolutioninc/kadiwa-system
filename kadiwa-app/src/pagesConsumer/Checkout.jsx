import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";
import { FaStore } from "react-icons/fa";

const Checkout = () => {
  const location = useLocation();
  const selectedItems = location.state.selectedItems;
  const [paymentOption, setPaymentOption] = useState('Cash');

  // Group items by store key
  const groupedItems = selectedItems.reduce((acc, item) => {
    if (!acc[item.storeKey]) {
      acc[item.storeKey] = [];
    }
    acc[item.storeKey].push(item);
    return acc;
  }, {});

  // Initialize shipping option state for each store
  const [shippingOptions, setShippingOptions] = useState(() => {
    const initialOptions = {};
    Object.keys(groupedItems).forEach(storeKey => {
      initialOptions[storeKey] = 'Delivery';
    });
    return initialOptions;
  });

  // Calculate total price for items in a store
  const calculateTotalPrice = (items) => {
    const totalPrice = items.reduce((acc, item) => {
      return acc + item.productInfo.price * item.productInfo.qty;
    }, 0);
    return totalPrice;
  };

  // Calculate shipping cost based on selected option
  const calculateShippingCost = (option) => {
    return option === 'Delivery' ? 58 : 0;
  };

  // Calculate total price including shipping for a store
  const calculateTotalPriceWithShipping = (items, option) => {
    return calculateTotalPrice(items) + calculateShippingCost(option);
  };

  // Handle change in shipping option for a store
  const handleShippingOptionChange = (storeKey, option) => {
    setShippingOptions(prevOptions => ({
      ...prevOptions,
      [storeKey]: option
    }));
  };

  // Calculate merchandise subtotal
  const merchandiseSubtotal = Object.values(groupedItems).reduce((acc, items) => {
    return acc + calculateTotalPrice(items);
  }, 0);

  // Calculate shipping subtotal
  const shippingSubtotal = Object.entries(shippingOptions).reduce((acc, [storeKey, option]) => {
    return acc + calculateShippingCost(option);
  }, 0);

  // Calculate total payment
  const totalPayment = merchandiseSubtotal + shippingSubtotal;

  return (
    <div className="container mx-auto bg-gray-200 h-screen">
      <div className='h-auto '>
        <div className='flex pt-4 mb-8 items-center space-x-2'>
        <div className='px-4'>
        <IoMdArrowRoundBack />
          </div>
        <h1 className="text-lg font-bold  text-green-700">Checkout</h1>

        </div>
        <div className=' px-4 bg-white py-2 mb-4 text-sm'>
          <p className='flex items-center font-bold text-gray-700'><FaLocationDot fontSize={"12px"}/>  Delivery Address</p>
          <p>Juan Dela Cruz | (+63) 900 000 0001</p>
          <p>Juan Street</p>
          <p>Coloong 1, Valenzuela, Metro Manila, 1445 </p>
        </div>
        
        {Object.entries(groupedItems).map(([storeKey, items]) => (
          <div key={storeKey} className="mb-4 shadow-lg bg-gray-100 rounded-md m-1">
            <h2 className="px-4 text-sm font-bold mb-4 text-green-600 py-2 flex items-center"><FaStore fontSize={"12px"} />{storeKey.split('-')[1]}</h2>
            <div className="bg-white rounded shadow-md">
              <ul>
                {items.map((item, index) => (
                  <li key={index} className="border-b border-gray-200 p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold mb-2">{item.productInfo.product_name}</p>
                      <p className="text-gray-600 text-xs"><span className="font-bold">Product ID:</span> {item.productId}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs"><span className="font-bold">Price:</span> ₱{item.productInfo.price}</p>
                      <p className="text-gray-600 text-xs"><span className="font-bold">Quantity:</span> {item.productInfo.qty}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="p-4 bg-gray-100 flex justify-between items-center">
                <div>
                  <label htmlFor={`shipping-option-${storeKey}`} className="font-bold text-gray-800 mr-2 text-sm">Shipping:</label>
                  <select
                    id={`shipping-option-${storeKey}`}
                    className="px-2 py-1 border border-gray-300 rounded"
                    value={shippingOptions[storeKey]}
                    onChange={(e) => handleShippingOptionChange(storeKey, e.target.value)}
                  >
                    <option value="Delivery">Delivery (+₱58)</option>
                    <option value="Pickup">Pickup (Free)</option>
                  </select>
                </div>
                <p className="text-sm font-bold text-gray-800">Total: ₱{calculateTotalPriceWithShipping(items, shippingOptions[storeKey]).toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}
        <div className='flex justify-between bg-white shadow-md mb-4 mx-1 rounded-md'>
          <label htmlFor="payment-option" className="font-bold text-gray-800 mr-2 text-sm p-4">Payment Option:</label>
          <select
            id="payment-option"
            className="px-2 py-1  border border-gray-300 rounded"
            value={paymentOption}
            onChange={(e) => setPaymentOption(e.target.value)}
          >
            <option value="Cash">Cash</option>
            <option value="Megapay">Megapay</option>
            <option value="Gcash">Gcash</option>
            <option value="Maya">Maya</option>
            <option value="Card">Card</option>
          </select>
        </div>
        <div className='bg-white py-2'>
          <p className="font-bold text-gray-800 mr-2 text-sm px-4 py-4">Payment Details:</p>
          <div className="px-4 text-xs font-bold text-gray-800 flex justify-between " >
            <span>Merchandise Subtotal</span>
            <span> ₱{merchandiseSubtotal.toFixed(2)}</span>

          </div>
          <div className="px-4 text-xs font-bold text-gray-800 flex justify-between " >
            <span>Shipping Subtotal</span>
            <span> ₱{shippingSubtotal.toFixed(2)}</span>

          </div>
          <div className="px-4 text-lg font-bold text-gray-800 flex justify-between " >
            <span className=''>Total Payment</span>
            <span> ₱{totalPayment.toFixed(2)}</span>

          </div>

        </div>
        <div className='flex justify-end  fixed bottom-0 w-full bg-white'>
          <div className='px-4 py-2'>
            <p className='text-sm'>Total Payment</p>
            <p className='text-green-700 font-bold '> ₱{totalPayment.toFixed(2)}</p>

          </div>
          <button className='bg-red-500 text-white px-4'>
            Place Order
          </button>

        </div>
        <div className='p-36'>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
