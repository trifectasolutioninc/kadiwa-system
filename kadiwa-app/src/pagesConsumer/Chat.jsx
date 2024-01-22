import React from 'react'
import { Notifications } from '@mui/icons-material';

const StoreCard = ({ id, name, logoAlt, chatMessages, date }) => (
    <a href={`./chat-${id}.html`}>
      <li className="relative bg-white p-4 rounded-lg shadow-md flex m-2 items-center">
        <img id={`shop${id}`} alt={logoAlt} className="mr-4" />
        <div>
          <p className="text-center font-semibold">{name}</p>
          <p className="text-xs text-gray-500">{chatMessages}</p>
        </div>
        <span className="absolute top-0 right-0 bg-white rounded-2xl p-1 text-xs text-gray-500">{date}</span>
      </li>
    </a>
  );

const Chat = () => {
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
          <Notifications className="text-gray-700" />
        </div>
      </div>

    <div className="p-4 flex justify-between">
      <h1 className="font-bold text-lg">Messages</h1>
      <span className="text-xs text-gray-500">Mark as read</span>
    </div>

    {/* Body Content */}
    <div className="container mx-auto mb-16">
      {/* Store Chat List */}
      <ul className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-1">
        {/* Store 1 */}
        <StoreCard id={1} name="Sari-sari Store" logoAlt="Store 1 Logo" chatMessages="Chat messages..." date="January 5, 2024" />

        {/* Store 2 */}
        <StoreCard id={2} name="Poultry Farm" logoAlt="Store 2 Logo" chatMessages="Chat messages..." date="January 5, 2024" />

        {/* Store 3 */}
        <StoreCard id={3} name="Poultry City" logoAlt="Store 3 Logo" chatMessages="Chat messages..." date="January 5, 2024" />

        {/* Store 4 */}
        <StoreCard id={4} name="Rice Shop" logoAlt="Store 4 Logo" chatMessages="Chat messages..." date="January 5, 2024" />

        {/* Store 5 */}
        <StoreCard id={5} name="FISHop" logoAlt="Store 5 Logo" chatMessages="Chat messages..." date="January 5, 2024" />

        {/* Add more stores as needed */}
      </ul>
    </div>
  </div>
  )
}

export default Chat
