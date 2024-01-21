import React from 'react'

const StoreConsumer = () => {
  return (
    <div>
    {/* Top Navigation with Search and Notification */}
    <div className="p-4 flex items-center justify-between bg-gray-100">
      {/* Search Input */}
      <div className="flex-grow">
        <input
          type="text"
          placeholder="Search..."
          className="w-full border p-2 rounded-md bg-gray-300 text-gray-600 focus:outline-none"
        />
      </div>

      {/* Notification Icon */}
      <div className="ml-4">
        <span className="material-icons text-gray-700">notifications</span>
      </div>
    </div>

    {/* Header */}
    <div className="p-4 flex justify-between">
      <h1 className="font-bold text-lg">Stores</h1>
      <span className="bg-white rounded-2xl p-1 text-xs text-gray-500">Select Products</span>
    </div>

    {/* Body Content */}
    <div className="container mx-auto mb-16">
      {/* Store List */}
      <ul className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-1">
        {/* Store 1 */}
        <li className="bg-white p-4 rounded-lg shadow-md flex m-2 items-center">
          <img id="shop1" alt="Store 1 Logo" className="mr-4" />
          <div>
            <p className="text-center font-semibold">Sari-sari Store</p>
            <p className="text-xs text-gray-500">Online Store</p>
          </div>
        </li>

        {/* Store 2 */}
        <li className="bg-white p-4 rounded-lg shadow-md flex m-2 items-center">
          <img id="shop2" alt="Store 2 Logo" className="mr-4" />
          <div>
            <p className="text-center font-semibold">Poultry Farm</p>
            <p className="text-xs text-gray-500">Online ,Physical Store</p>
          </div>
        </li>

        {/* Store 3 */}
        <li className="bg-white p-4 rounded-lg shadow-md flex m-2 items-center">
          <img id="shop3" alt="Store 3 Logo" className="mr-4" />
          <div>
            <p className="text-center font-semibold">Poultry City</p>
            <p className="text-xs text-gray-500">Online Store</p>
          </div>
        </li>

        {/* Store 4 */}
        <li className="bg-white p-4 rounded-lg shadow-md flex m-2 items-center">
          <img id="shop4" alt="Store 4 Logo" className="mr-4" />
          <div>
            <p className="text-center font-semibold">Rice Shop</p>
            <p className="text-xs text-gray-500">Online ,Physical Store</p>
          </div>
        </li>

        {/* Store 5 */}
        <li className="bg-white p-4 rounded-lg shadow-md flex m-2 items-center">
          <img id="shop5" alt="Store 5 Logo" className="mr-4" />
          <div>
            <p className="text-center font-semibold">FISHop</p>
            <p className="text-xs text-gray-500">Online Store</p>
          </div>
        </li>

        {/* Add more stores as needed */}
      </ul>
    </div>
  </div>
  )
}

export default StoreConsumer
