import React, { useState, useEffect } from "react";
import { ref, child, get, remove } from "firebase/database";
import configFirebaseDB from "../Configuration/config-firebase2";
import { Link } from "react-router-dom";

import BackButton from "./BackToHome";

const StoreCard = ({ id, name, logoAlt, chatMessages, date, onLongPress }) => {
  const getLastMessage = () => {
    const messagesArray = Object.values(chatMessages);
    const lastMessage = messagesArray[messagesArray.length - 1];
  
    if (lastMessage) {
      const boldStyle = {
        fontWeight: "bold"
      };
  
      const messageStyle = lastMessage.status === "unread" && lastMessage.sender === "partner" ? boldStyle : {};
  
      return (
        <div>
            

            <p style={messageStyle}>{lastMessage.message} - {lastMessage.time}</p>

        </div>
        
      );
    }
  
    return "No messages yet";
  };
  

  return (
    <Link
      to={`/route/chatpage/${id.split("_")[1]}/chat`}
      className="no-underline"
    >
      <li
        className="relative bg-slate-50 p-4 rounded-lg shadow-md flex items-center border hover:bg-green-50"
        onContextMenu={(e) => {
          e.preventDefault();
          onLongPress(id);
        }}
      >
        <div>
          <p className="font-semibold text-green-800">{name}</p>
          <p className="text-xs text-gray-500">{getLastMessage()}</p>
        </div>
      </li>
    </Link>
  );
};

const Chat = () => {
  const [chatData, setChatData] = useState([]);
  const [longPressedMessage, setLongPressedMessage] = useState(null);
  const uid = sessionStorage.getItem("uid");

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        const snapshot = await get(
          child(ref(configFirebaseDB), "chat_collections")
        );
        const chatCollections = snapshot.val();
    
        console.log("chatCollections:", chatCollections); // Log chatCollections to check if data is fetched correctly
    
        if (chatCollections) {
          const chatDataArray = Object.entries(chatCollections).map(
            ([id, data]) => {
              console.log("storeName:", data.storeName); // Log storeName to check if it's fetched correctly
              return {
                id,
                name: data.storeName,
                Chat: data.Chat,
                date: data.date,
              };
            }
          );
    
          setChatData(chatDataArray);
        }
      } catch (error) {
        console.error("Error fetching chat data:", error);
      }
    };
    
    fetchChatData();
  }, []);

  const handleLongPress = (messageId) => {
    setLongPressedMessage(messageId);
  };

  const handleDelete = async () => {
    try {
      // Remove the chat data from Firebase
      await remove(
        child(ref(configFirebaseDB), `chat_collections/${longPressedMessage}`)
      );
      console.log("Message deleted successfully:", longPressedMessage);
      setLongPressedMessage(null); // Clear longPressedMessage state after deletion
      // Update chatData state to reflect the deletion
      setChatData((prevChatData) =>
        prevChatData.filter((store) => store.id !== longPressedMessage)
      );
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  return (
    <>
      <div className="fixed flex items-center gap-5 bg-green-700 w-full top-0 p-3 right-0 left-0 shadow-md">
        <div className="flex items-center gap-5 ">
          <BackButton />
          <h1 className="text-xl text-neutral-100  font-bold">Messages</h1>
        </div>
      </div>
      <main className="p-3 md:p-10 space-y-5  mt-14 ">
        <div className="flex items-center justify-between">
          <div className="flex-grow">
            <input
              type="text"
              placeholder="Search..."
              className="w-full border p-2 rounded-md bg-gray-300 text-gray-600 focus:outline-none"
            />
          </div>
        </div>

        <div className="container mx-auto mb-16">
          <ul className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
            {/* Filter chatData based on uid and map through filtered data */}
            {chatData
              .filter((store) => uid === store.id.split("_")[0])
              .map((store) => (
                <StoreCard
                  key={store.id}
                  id={store.id}
                  name={store.name}
                  logoAlt={`Store ${store.id} Logo`}
                  chatMessages={store.Chat}
                  date={store.date}
                  onLongPress={handleLongPress}
                />
              ))}
          </ul>
        </div>
      </main>

      {/* Modal for delete confirmation */}
      {longPressedMessage && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex  justify-center items-center">
          <div className="bg-white p-4 rounded-md shadow-md">
            <p>Are you sure you want to delete this message?</p>
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md mr-2"
                onClick={handleDelete}
              >
                Delete
              </button>
              <button
                className="px-4 py-2 bg-gray-300 rounded-md"
                onClick={() => setLongPressedMessage(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chat;
