import React, { useState, useEffect } from "react";
import { ref, child, get } from "firebase/database"; // Import Firebase database methods
import configFirebaseDB from "../Configuration/config-firebase2";
import { Link } from "react-router-dom";

import BackButton from "./BackToHome";

const StoreCard = ({ id, name, logoAlt, chatMessages, date }) => {
  const formatDate = (timestamp) => {
    console.log("Raw Timestamp:", timestamp);
    if (!timestamp) {
      return ""; // Handle the case where timestamp is undefined or null
    }

    const [year, month, day, hour, minute, second] = timestamp.split("-");

    const date = new Date(year, month - 1, day, hour, minute, second);

    const options = {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };

    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
      date
    );
    return formattedDate.replace(/(\d{1,2}:\d{2}):(\d{2}) (AM|PM)/, "$1 $3");
  };

  const getLastMessage = () => {
    const messagesArray = Object.values(chatMessages);
    const lastMessage = messagesArray[messagesArray.length - 1];

    if (lastMessage) {
      const formattedDate = formatDate(lastMessage.time);
      return `${lastMessage.message} - ${formattedDate}`;
    }

    return "No messages yet";
  };

  return (
    <Link
      to={`/route/chatpage/${id.split("_")[1]}/chat`}
      className="no-underline"
    >
      <li className="relative bg-white p-4 rounded-lg shadow-md flex items-center border">
        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-xs text-gray-500">{getLastMessage()}</p>
        </div>
      </li>
    </Link>
  );
};

const Chat = () => {
  const [chatData, setChatData] = useState([]);
  const uid = sessionStorage.getItem("uid");

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        const snapshot = await get(
          child(ref(configFirebaseDB), "chat_collections")
        );
        const chatCollections = snapshot.val();

        if (chatCollections) {
          const chatDataArray = Object.entries(chatCollections).map(
            ([id, data]) => ({
              id,
              name: data.storeName,
              Chat: data.Chat,
              date: data.date,
            })
          );

          setChatData(chatDataArray);
        }
      } catch (error) {
        console.error("Error fetching chat data:", error);
      }
    };

    fetchChatData();
  }, []);

  return (
    <>
      <div className="fixed flex items-center gap-5 bg-white w-full top-0 p-3 right-0 left-0 shadow-md">
        <div className="flex items-center gap-5 ">
          <BackButton />
          <h1 className="text-xl text-green-600  font-bold">Messages</h1>
        </div>
      </div>
      <main className="p-3 md:p-10 space-y-5  mt-14">
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
          <ul className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-1">
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
                />
              ))}
          </ul>
        </div>
      </main>
    </>
  );
};

export default Chat;
