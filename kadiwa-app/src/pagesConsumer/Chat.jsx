import React, { useState, useEffect } from 'react';
import { Notifications } from '@mui/icons-material';
import { ref, child, get, onValue, off } from 'firebase/database'; // Import Firebase database methods
import configFirebaseDB from '../Configuration/config-firebase2';
import { Link } from 'react-router-dom'; 

const StoreCard = ({ id, name, logoAlt, chatMessages, date }) => {

  const formatDate = (timestamp) => {
    console.log("Raw Timestamp:", timestamp);
    if (!timestamp) {
      return ''; // Handle the case where timestamp is undefined or null
    }
  
    const [year, month, day, hour, minute, second] = timestamp.split('-');
    
    const date = new Date(year, month - 1, day, hour, minute, second);
    
    const options = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    };
  
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
    return formattedDate.replace(/(\d{1,2}:\d{2}):(\d{2}) (AM|PM)/, '$1 $3');
  };

  const getLastMessage = () => {
    const messagesArray = Object.values(chatMessages);
    const lastMessage = messagesArray[messagesArray.length - 1];

    if (lastMessage) {
      const formattedDate = formatDate(lastMessage.time);
      return `${lastMessage.message} - ${formattedDate}`;
    }

    return 'No messages yet';
  };

  return (
    <Link to={`/route/chatpage/${id.split('_')[1]}`} className="no-underline">
      <li className="relative bg-white p-4 rounded-lg shadow-md flex m-2 items-center">
          
        <div >
          <p className="font-semibold">{name}</p>
          <p className="text-xs text-gray-500">{getLastMessage()}</p>
        </div>
      </li>
    </Link>
  );
};    

const Chat = () => {
  const [chatData, setChatData] = useState([]);

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        // Replace 'yourApiCallToGetChatData' with your actual logic to fetch chat data
        const snapshot = await get(child(ref(configFirebaseDB), 'chat_collections'));
        const chatCollections = snapshot.val();

        if (chatCollections) {
          // Convert the object into an array
          const chatDataArray = Object.entries(chatCollections).map(([id, data]) => ({
            id,
            name: data.storeName,

            Chat: data.Chat,
            date: data.date, // Replace with your actual date property
          }));

          setChatData(chatDataArray);
        }
      } catch (error) {
        console.error('Error fetching chat data:', error);
      }
    };

    fetchChatData();
  }, []);

  return (
    <div className='bg-gray-100  h-screen'>
     
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
      <h1 className='text-lg text-green-600 px-4 font-bold'>Messages </h1>
      {/* Body Content */}
      <div className="container mx-auto mb-16">
        {/* Store Chat List */}
        <ul className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-1">
          {/* Map through chatData and render StoreCard for each chat */}
          {chatData.map((store) => (
            <StoreCard
              key={store.id}
              id={store.id}
              name={store.name}
              logoAlt={`Store ${store.id} Logo`}
              chatMessages={store.Chat}
              date={store.date}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Chat;
