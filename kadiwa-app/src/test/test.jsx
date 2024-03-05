import React, { useState } from "react";

function getLastChar(str) {
  // Use the slice method to get the last character
  return str.slice(-1);
}

function App() {
  const [inputString, setInputString] = useState("");
  const [sumChar, setsumChar] = useState("");

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setInputString(inputValue);
    setsumChar(sumChar + getLastChar(inputValue));
  };

  return (
    <div>
      <input
        type="text"
        value={inputString}
        onChange={handleInputChange}
        placeholder="Enter comma-separated strings"
      />
      <p>Concatenated Last Characters: {sumChar}</p>
    </div>
  );
}

export default App;
