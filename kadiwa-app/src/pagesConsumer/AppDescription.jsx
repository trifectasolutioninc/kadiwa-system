import React, { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

function AppDescription() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };
  return (
    <>
      <button
        className="w-full flex items-center justify-between text-black/80 p-3 border border-green-700 rounded-md cursor-pointer"
        onClick={toggleDropdown}
      >
        <h1 className="font-bold text-green-700">About Kadiwa App</h1>
        <div className="text-green-700">
          {isDropdownOpen === true ? <IoIosArrowUp /> : <IoIosArrowDown />}
        </div>
      </button>

      {isDropdownOpen && (
        <section className="text-black/80 space-y-3 p-3 border mt-3 border-gray-700 rounded-md">
          <p className="leading-relaxed text-justify">
            The <span className="font-semibold text-green-700">Kadiwa App</span>{" "}
            is a revolutionary tool that connects users directly with local
            farmers, enabling them to buy essentials without intermediaries. It
            eliminates middlemen, providing fresh produce and fair deals. The
            app also empowers local farmers by providing a direct way to sell
            their goods, ensuring access to good food.
          </p>
        </section>
      )}
    </>
  );
}

export default AppDescription;
