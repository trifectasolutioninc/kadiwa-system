import React from "react";

const CartItem = ({
  id,
  name,
  price,
  quantity,
  imgAlt,
  isChecked,
  onCheckboxChange,
  onIncrement,
  onDecrement,
}) => {
  // Calculate subtotal for the item
  const subtotal = (price * quantity).toFixed(2);

  return (
    <>
      <section className="items-center p-2 grid grid-cols-10 border rounded-md shadow-md bg-white">
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
          <div>
            <div className=" justify-between flex items-center">
              <p className="font-semibold text-green-700 text-lg">{`Php ${price.toFixed(
                2
              )}`}</p>
              <div className="flex items-center ">
                <span className="text-sm pr-2 font-bold text-gray-500">
                  Qty:
                </span>
                <div className="flex items-center gap-1">
                  <button
                    className="px-2 border rounded bg-red-500 text-white"
                    onClick={onDecrement}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    className="w-12 h-8 text-center border rounded-md"
                    readOnly
                  />
                  <button
                    className=" px-2 border rounded bg-blue-500 text-white "
                    onClick={onIncrement}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <p className="font-semibold text-gray-700 text-[0.8em] text-right">{`Subtotal: Php ${subtotal}`}</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default CartItem;
