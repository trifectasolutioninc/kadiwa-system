import React, { useState, useEffect, useRef } from "react";
import { useParams, NavLink } from "react-router-dom";
import { ref, get, onValue, off, set, update } from "firebase/database";
import firebaseDB from "../Configuration/config-firebase2";
import { IoMdArrowRoundBack } from "react-icons/io";
import { ChatBOT } from "../services/AI/chat-bot";


const ChatPage = () => {
  const maxTextareaHeight = 120;
  const { storeID , page } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [storeName, setStoreName] = useState("");
  const [ownerID, setOwnerID] = useState("");
  const [getpage] = useState(page);
  const [userDetails, setUserDetails] = useState(null);
  const uid = sessionStorage.getItem("uid");
  const messageEndRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await get(
          ref(firebaseDB, "store_information/" + storeID)
        );
        const userData = snapshot.val();

        if (userData && userData.name) {
          setStoreName(userData.name);
          setOwnerID(userData.id);
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
  
    const handleNewMessage = async (snapshot) => {
      const chatData = snapshot.val();
  
      if (chatData && chatData.Chat) {
        const messagesArray = Object.values(chatData.Chat).map((message) => {
          return {
            ...message,
            id: message.time // Add unique ID for each message
          };
        });
  
        // Iterate through messages to update status to "read" for bot and partner messages
        const updatedMessages = messagesArray.map((message) => {
          if ((message.sender === "bot" || message.sender === "partner") && message.status !== "read") {
            return { ...message, status: "read" };
          }
          return message;
        });
  
        setMessages(updatedMessages);
  
        // Update the status of bot and partner messages in the database
        const updates = {};
        updatedMessages.forEach(message => {
          updates[`Chat/${message.id}/status`] = message.status;
        });
        await update(chatRef, updates); // Corrected update call here
      } else if (messages.length === 0) {
        // If there are no messages, initiate conversation with bot
        sendChatMessage("Good Day! Welcome to our store!", "bot");
      }
    };
  
    onValue(chatRef, handleNewMessage);
  
    return () => {
      // Detach the event listener when component unmounts
      off(chatRef, "value", handleNewMessage);
    };
  }, [storeID, storeName, uid, messages.length]);
  
  
  
  
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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

  const sendChatMessage = async (message, sender) => {
    try {
      const chatId = `${uid}_${storeID}`;
      const chatRef = ref(firebaseDB, `chat_collections/${chatId}`);
  
      const timestamp = generateUniqueId(); // Use timestamp-based unique ID
  
      console.log("Store ID:", storeID);
      console.log("Store Name:", storeName);
  
      let consumerName = "Unknown"; // Default consumer name
  
      // Check if userDetails is not null and contains first_name
      if (userDetails && userDetails.first_name) {
        consumerName = userDetails.first_name + " " + userDetails.last_name;
      }
  
      let botReply = null;
      let maxMatchingKeywords = 0;
  
      // Iterate through each chat bot object
      for (const bot of Object.values(ChatBOT)) {
        let matchingKeywords = 0;
        // Check if the message matches any keyword from the chat bot
        for (const keyword of bot.keywords) {
          if (message.toLowerCase().includes(keyword)) {
            matchingKeywords++;
          }
        }
        if (matchingKeywords > maxMatchingKeywords) {
          maxMatchingKeywords = matchingKeywords;
          botReply = bot;
        }
      }
  
      const newMessage = {
        img: "",
        message,
        sender: sender || "consumer", // Default sender is consumer
        time: timestamp,
        status: "unread",
      };
  
      // Get the current chat data
      const currentChatData = await get(chatRef);
      const existingChat = currentChatData.val();
  
      const chatData = {
        storeName: storeName,
        storeOwner: ownerID,
        consumer: uid,
        consumerName: consumerName,
        Chat: {
          ...existingChat?.Chat, // Keep existing messages
          [timestamp]: newMessage, // Add the new message
        },
      };
  
      if (botReply) {
        // Add a delay of 3 seconds before sending the bot reply
        setTimeout(() => {
          const botMessage = {
            img: "",
            message: botReply.message,
            sender: "bot", // Set sender as bot
            time: generateUniqueId(),
            status: "unread",
          };
          chatData.Chat[generateUniqueId()] = botMessage;
          // Set the updated data under the unique chatId
          set(chatRef, chatData);
        }, 1000);
      }
  
      // Set the updated data under the unique chatId immediately for user message
      set(chatRef, chatData);
  
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
      { getpage === "store" && (

        <NavLink to={`/main/storepage/${storeID}`} className="">
          <IoMdArrowRoundBack fontSize={"25px"} />
        </NavLink>

      )}
      { getpage === "chat" && (

        <NavLink to={`/main/chat`} className="">
          <IoMdArrowRoundBack fontSize={"25px"} />
        </NavLink>

        )}
        { getpage === "store" && (

<NavLink to={`/main/store`} className="">
  <IoMdArrowRoundBack fontSize={"25px"} />
</NavLink>

)}
        
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
              <p>{message.message}</p>
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
        {/* Empty div used as a reference point to scroll to */}
        <div ref={messageEndRef}></div>
      </div>
      <div className="h-20" ></div>
      
      <div className="p-4 bg-white shadow-md fixed bottom-0  w-full z-50">
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
