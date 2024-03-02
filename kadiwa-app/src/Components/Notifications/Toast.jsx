// Toast.js

import React, { useEffect } from "react";

const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // Adjust the time as needed

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-20 w-full flex justify-center items-center z-50">
      <p className="bg-gray-800 text-white px-4 py-2 rounded-md text-center">
        {message}
      </p>
    </div>
  );
};

export default Toast;
