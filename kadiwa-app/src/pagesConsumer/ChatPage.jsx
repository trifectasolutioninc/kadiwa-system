import React, { useState, useEffect } from "react";
import { useParams, Link, NavLink } from "react-router-dom";
import { ref, child, get, push, set, onValue, off } from "firebase/database";
import firebaseDB from "../Configuration/config-firebase2";
import { IoMdArrowRoundBack } from "react-icons/io";

const ChatPage = () => {
  const maxTextareaHeight = 120;
  const { storeID } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [storeName, setStoreName] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [ownerID, setownerID] = useState("");
  const kdwconnect = sessionStorage.getItem("kdwconnect");
  const uid = sessionStorage.getItem("uid");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await get(
          child(ref(firebaseDB), "store_information/" + storeID)
        );
        const userData = snapshot.val();

        if (userData && userData.name) {
          setStoreName(userData.name);
          setownerID(userData.id);
        }
      } catch (error) {
        console.error("Error fetching store data:", error);
      }
    };

    fetchData();
  }, [storeID]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await get(ref(firebaseDB, "users_information"));
        const userData = snapshot.val();

        if (userData && userData[uid]) {
          setUserDetails(userData[uid]);
        } else {
          console.error("User not found");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (uid) {
      fetchData();
    }
  }, [uid]);

  useEffect(() => {
    const chatId = `${uid}_${storeID}`;
    const chatRef = ref(firebaseDB, `chat_collections/${chatId}`);

    const handleNewMessage = (snapshot) => {
      const chatData = snapshot.val();

      if (chatData && chatData.Chat) {
        const messagesArray = Object.values(chatData.Chat).map((message) => {
          return {
            sender: message.sender,
            text: message.message,
            time: message.time,
          };
        });

        setMessages(messagesArray);
      }
    };

    onValue(chatRef, handleNewMessage);

    return () => {
      // Detach the event listener when component unmounts
      off(chatRef, "value", handleNewMessage);
    };
  }, [storeID, storeName]);
  // Function to generate timestamp-based unique ID
  const generateUniqueId = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");

    return `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;
  };

  const sendChatMessage = async (message) => {
    try {
      const chatId = `${uid}_${storeID}`;
      const chatRef = ref(firebaseDB, `chat_collections/${chatId}`);

      const timestamp = generateUniqueId(); // Use timestamp-based unique ID

      console.log("Store ID:", storeID);
      console.log("Store Name:", storeName);

      const newMessage = {
        img: "",
        message,
        sender: "consumer",
        time: timestamp,
      };

      // Get the current chat data
      const currentChatData = await get(chatRef);
      const existingChat = currentChatData.val();

      const chatData = {
        storeName: storeName,
        storeOwner: ownerID,
        consumer: uid,
        consumerName: userDetails.first_name + " " + userDetails.last_name,
        Chat: {
          ...existingChat?.Chat, // Keep existing messages
          [timestamp]: newMessage, // Add the new message
        },
      };

      // Set the updated data under the unique chatId
      await set(chatRef, chatData);

      console.log("Message sent successfully!");
    } catch (error) {
      console.error("Error sending chat message:", error);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      setMessages([...messages, { sender: "user", text: newMessage }]);
      sendChatMessage(newMessage);
      setNewMessage("");
    }
  };

  const formatDate = (timestamp) => {
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

  return (
    <div className="h-screen bg-gray-200 flex flex-col">
      <div className="flex gap-5 items-center p-4 bg-white shadow-md">
        <NavLink to={`/main/storepage/${storeID}`} className="">
          <IoMdArrowRoundBack fontSize={"25px"} />
        </NavLink>
        <h1 className="text-gray-700 font-bold text-lg">{storeName}</h1>
      </div>

      <div
        className="flex-1 overflow-y-auto p-4"
        style={{ whiteSpace: "pre-line" }}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={`my-2 ${
              message.sender === "consumer" ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block p-2 rounded-lg ${
                message.sender === "consumer"
                  ? "bg-green-500 text-white"
                  : "bg-white"
              }`}
            >
              <p>{message.text}</p>
            </div>
            <p
              className={`text-xs text-gray-500 ${
                message.sender === "consumer" ? "text-right " : "text-left"
              }`}
            >
              {formatDate(message.time)}
            </p>
          </div>
        ))}
      </div>

      <div className="p-4 bg-white shadow-md fixed bottom-0  w-full">
        <div className="flex items-center">
          <textarea
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);

              // Adjust textarea height dynamically based on content
              const textarea = e.target;
              textarea.style.height = "50px"; // Reset height to auto
              textarea.style.height = ` ${Math.min(
                textarea.scrollHeight,
                maxTextareaHeight
              )}px`;
            }}
            placeholder="Type your message..."
            className="flex-1 p-2 mr-2 border border-gray-300 rounded"
            style={{ height: "50px", maxHeight: `${maxTextareaHeight}px` }}
            rows="3" // Set the number of visible rows
          />
          <button
            onClick={handleSendMessage}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
