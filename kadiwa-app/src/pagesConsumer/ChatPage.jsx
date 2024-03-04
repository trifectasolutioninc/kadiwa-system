import React, { useState, useEffect, useRef } from "react";
import { useParams, NavLink } from "react-router-dom";
import { ref, get, onValue, off, set, update } from "firebase/database";
import firebaseDB from "../Configuration/config-firebase2";
import { IoMdArrowRoundBack } from "react-icons/io";
import { ChatBOT } from "../services/AI/chat-bot";

const ChatPage = () => {
  const maxTextareaHeight = 120;
  const { storeID, page } = useParams();
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
          sessionStorage.setItem("STRN", userData.name);
          setOwnerID(userData.id);
          sessionStorage.setItem("STRID", userData.id);
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
            id: message.time,
          };
        });

        const updatedMessages = messagesArray.map((message) => {
          if (
            (message.sender === "bot" || message.sender === "partner") &&
            message.status !== "read"
          ) {
            return { ...message, status: "read" };
          }
          return message;
        });

        setMessages(updatedMessages);

        const updates = {};
        updatedMessages.forEach((message) => {
          updates[`Chat/${message.id}/status`] = message.status;
        });
        await update(chatRef, updates);
      } else if (messages.length === 0) {
        sendChatMessage("Good Day! Welcome to our store!", "bot");
      }
    };

    onValue(chatRef, handleNewMessage);

    return () => {
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

      const timestamp = generateUniqueId();

      console.log("Store ID:", storeID);
      console.log("Store Name:", storeName);

      let consumerName = "Unknown";

      if (userDetails) {
        consumerName = userDetails.fullname;
      }

      let botReply = null;
      let maxMatchingKeywords = 0;

      for (const bot of Object.values(ChatBOT)) {
        let matchingKeywords = 0;

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
        sender: sender || "consumer",
        time: timestamp,
        status: "unread",
      };

      const currentChatData = await get(chatRef);
      const existingChat = currentChatData.val();
      const STRN = sessionStorage.getItem("STRN");
      const STRID = sessionStorage.getItem("STRID");
      if (storeName == "" || ownerID == "") {
        storeName = STRN;
        ownerID = STRID;
      }
      const chatData = {
        storeName: storeName,
        storeOwner: ownerID,
        consumer: uid,
        consumerName: consumerName,
        Chat: {
          ...existingChat?.Chat,
          [timestamp]: newMessage,
        },
      };

      if (botReply) {
        setTimeout(() => {
          const timestamp2 = generateUniqueId();
          const botMessage = {
            img: "",
            message: botReply.message,
            sender: "bot",
            time: timestamp2,
            status: "unread",
          };

          const updatedChatData = {
            storeName: storeName,
            storeOwner: ownerID,
            consumer: uid,
            consumerName: consumerName,
            Chat: {
              ...chatData.Chat,
              [timestamp2]: botMessage,
            },
          };

          update(chatRef, updatedChatData);
        }, 1000);
      }

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
      return "";
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
    <div className="h-screen flex flex-col">
      <div className="fixed flex items-center gap-5 bg-green-700 w-full top-0 p-3 right-0 left-0 shadow-md overflow-x-hidden z-50">
        <div className="flex gap-5 items-center ">
          {getpage === "store" && (
            <NavLink to={`/main/storepage/${storeID}`} className="">
              <IoMdArrowRoundBack
                fontSize={"25px"}
                className="text-neutral-100"
              />
            </NavLink>
          )}
          {getpage === "chat" && (
            <NavLink to={`/main/chat`} className="">
              <IoMdArrowRoundBack
                fontSize={"25px"}
                className="text-neutral-100"
              />
            </NavLink>
          )}
          {getpage === "store-home" && (
            <NavLink to={`/main/store`} className="">
              <IoMdArrowRoundBack
                fontSize={"25px"}
                className="text-neutral-100"
              />
            </NavLink>
          )}

          <h1 className="text-neutral-100 font-bold text-lg">{storeName}</h1>
        </div>
      </div>

      <div
        className="inline-block flex-1 p-4 mt-14 text-black/80"
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
              className={`inline-block max-w-72 break-words p-2 rounded-lg ${
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

        <div ref={messageEndRef}></div>
      </div>
      <div className="h-24"></div>

      <div className="p-4 bg-white shadow-md fixed bottom-0  w-full z-50">
        <div className="flex items-center">
          <textarea
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              const textarea = e.target;
              textarea.style.height = "50px";
              textarea.style.height = ` ${Math.min(
                textarea.scrollHeight,
                maxTextareaHeight
              )}px`;
            }}
            placeholder="Type your message..."
            className="flex-1 p-2 mr-2 border border-gray-300 rounded"
            style={{ height: "50px", maxHeight: `${maxTextareaHeight}px` }}
            rows="3"
            maxLength={500}
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
