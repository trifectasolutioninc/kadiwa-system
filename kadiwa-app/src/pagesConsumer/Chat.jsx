import React, { useState, useEffect } from "react";
import { ref, child, get, remove } from "firebase/database";
import configFirebaseDB from "../Configuration/config-firebase2";
import FirebaseDB from "../Configuration/config";
import { Link, NavLink } from "react-router-dom";
import {
  LocationCityRounded,
  LocationOn,
  Notifications,
} from "@mui/icons-material";

import BackButton from "./BackToHome";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";

const StoreCard = ({
  id,
  name,
  logoAlt,
  chatMessages,
  date,
  onLongPress,
  onDelete,
}) => {
  const [startX, setStartX] = useState(null);
  const [offsetX, setOffsetX] = useState(0);

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (startX !== null) {
      const currentX = e.touches[0].clientX;
      const diffX = currentX - startX;
      setOffsetX(diffX);
      console.log(offsetX);
    }
  };

  const handleTouchEnd = () => {
    if (startX !== null && offsetX < -50) {
      onDelete(id);
    }
    setStartX(null);
    setOffsetX(0);
  };

  const getLastMessage = () => {
    const messagesArray = Object.values(chatMessages);
    const lastMessage = messagesArray[messagesArray.length - 1];

    if (lastMessage) {
      const boldStyle = {
        fontWeight: "bold",
      };

      const messageStyle =
        lastMessage.status === "unread" && lastMessage.sender === "partner"
          ? boldStyle
          : {};

      return (
        <div className="space-y-1">
          <p
            style={messageStyle}
            className=" max-w-56 md:max-w-[600px] truncate"
          >
            {lastMessage.message}
          </p>
          <p style={messageStyle} className="text-gray-500">
            {lastMessage.time}
          </p>
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
        className="relative bg-amber-50 p-4 rounded-lg shadow-md flex items-center border hover:bg-green-50"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateX(${offsetX}px)`,
          transition: "transform 0.3s ease",
        }}
      >
        <section className="flex items-center gap-5">
          <div className="bg-white border p-2 rounded-full">
            <IoChatbubbleEllipsesSharp
              fontSize={"35px"}
              className="text-green-700"
            />
          </div>

          <div className="space-y-1">
            <p className="font-bold text-lg  text-green-800 tracking-wide">
              {name}
            </p>
            <p className="text-sm text-black/80">{getLastMessage()}</p>
          </div>
        </section>
      </li>
    </Link>
  );
};

const Chat = () => {
  const [chatData, setChatData] = useState([]);
  const [longPressedMessage, setLongPressedMessage] = useState(null);
  const uid = sessionStorage.getItem("uid");
  const [storeList, setStoreList] = useState([]);
  const [storeAddressData, setStoreAddress] = useState([]);

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

  useEffect(() => {
    const fetchStores = async () => {
      const database = FirebaseDB();
      const storeRef = ref(database, "store_information");
      const storeAddressRef = ref(database, "store_address_information");

      try {
        const storeSnapshot = await get(storeRef);
        const storeAddressSnapshot = await get(storeAddressRef);

        if (storeSnapshot.exists() && storeAddressSnapshot.exists()) {
          const stores = Object.values(storeSnapshot.val());
          const storeAddress = Object.values(storeAddressSnapshot.val());
          setStoreList(stores);
          setStoreAddress(storeAddress);
        } else {
          console.error("No stores found");
        }
      } catch (error) {
        console.error("Error fetching store data:", error);
      }
    };

    fetchStores();
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
      <div className="fixed flex items-center gap-5 bg-green-700 w-full top-0 p-3 right-0 left-0 shadow-md overflow-x-hidden z-50">
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
              maxLength={24}
            />
          </div>
        </div>
        <div className=" h-1/2 space-y-2">
          <p className="text-[1em] mx-2 text-black/80 font-medium">Chats</p>
          <div className="container mx-auto mb-16">
            <ul className="grid grid-cols-1 gap-4">
              {chatData.filter((store) => uid === store.id.split("_")[0])
                .length === 0 ? (
                <section className="flex flex-col items-center text-center p-5 border space-y-2 border-green-300 bg-green-100 rounded-md">
                  <h1 className="text-black/80 font-semibold">
                    Chat box empty! Ask us anything you fancy.
                  </h1>
                </section>
              ) : (
                chatData
                  .filter((store) => uid === store.id.split("_")[0])
                  .map((store) => (
                    // Inside Chat component
                    <StoreCard
                      key={store.id}
                      id={store.id}
                      name={store.name}
                      logoAlt={`Store ${store.id} Logo`}
                      chatMessages={store.Chat}
                      date={store.date}
                      onLongPress={handleLongPress}
                      onDelete={() => handleLongPress(store.id)} // Pass onDelete handler
                    />
                  ))
              )}
            </ul>
          </div>
        </div>
        <div className=" h-1/2 space-y-2">
          <p className="text-[1em] mx-2 text-black/80 font-medium">
            Suggested Stores Near You
          </p>
          <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {storeList.map(
              (store) =>
                // Conditionally render the container only for stores with 'usertype' as 'Partner'
                store.status === "open" && (
                  <Link
                    to={`/route/chatpage/${store.id}/chat`}
                    key={store.id}
                    className="bg-slate-50 p-4 rounded-lg shadow-md items-center grid grid-cols-10 border hover:bg-green-50 "
                  >
                    {/* <img src={store.logo} alt={`Store ${store.id} Logo`} className="mr-4 col-span-2" /> */}
                    <section className="col-span-9 text-left space-y-2">
                      <p className="text-lg font-bold text-black/80 tracking-wide">
                        {store.name}
                      </p>
                      <p>
                        <span
                          className={`px-3 py-1 rounded-full font-medium ${
                            store.type === "Online Store"
                              ? "bg-blue-200 text-blue-900" // Example color for "online" status
                              : store.type === "Physical Store"
                              ? "bg-orange-200 text-orange-900" // Example color for "Physical" status
                              : store.type === "omnichannel"
                              ? "bg-green-200 text-green-900" // Example color for "omni" status
                              : "bg-gray-500 text-white" // Default color for unknown status
                          }`}
                        >
                          {store.type}
                        </span>
                      </p>

                      {storeAddressData.find(
                        (address) => address.id === store.id
                      ) && (
                        <p className=" text-gray-500">
                          <LocationOn
                            fontSize="25px"
                            className="text-green-600"
                          />
                          {
                            storeAddressData.find(
                              (address) => address.id === store.id
                            ).city
                          }
                          ,{" "}
                          {
                            storeAddressData.find(
                              (address) => address.id === store.id
                            ).province
                          }
                        </p>
                      )}
                    </section>
                    <div className="col-span-1 flex justify-end "></div>
                  </Link>
                )
            )}
          </section>
        </div>
        <h1 className="text-center text-black/80">
          Appreciate your interest! This marks the end of the page.
        </h1>
        <div className=" h-16"></div>
      </main>

      {/* Modal for delete confirmation */}
      {longPressedMessage && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex  justify-center items-center">
          <div className="bg-white  w-3/4 p-4 rounded-md shadow-md">
            <p>Are you sure you want to delete this message?</p>
            <div className="flex justify-end mt-4 gap-3">
              <button
                className="px-3 py-2  rounded-md"
                onClick={() => setLongPressedMessage(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md mr-2"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chat;
