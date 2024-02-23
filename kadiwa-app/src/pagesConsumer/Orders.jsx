import React, { useEffect, useState } from "react";
import { NavLink, useParams, useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { MdLocalShipping } from "react-icons/md";
import { FaJoget } from "react-icons/fa";
import { FaBoxOpen } from "react-icons/fa";
import { FaBox } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { FiMinusCircle } from "react-icons/fi";
import { IoWalletOutline } from "react-icons/io5";
import {
  ref,
  getDatabase,
  orderByChild,
  equalTo,
  get,
} from "firebase/database";
import { MdDeliveryDining } from "react-icons/md";

const Orders = () => {
  const { tab, getstatus } = useParams();
  const uid = sessionStorage.getItem("uid");
  const [status, setStatus] = useState(getstatus);

  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getDatabase();
        const ordersRef = ref(db, "orders_list");

        const snapshot = await get(ordersRef);
        let filteredOrders = []; // Move declaration here

        if (snapshot.exists()) {
          const ordersData = snapshot.val();
          // Filter orders based on the status

          filteredOrders = Object.values(ordersData).filter(
            (order) =>
              (order.shippingOption.toLowerCase() === tab &&
                order.status.toLowerCase() === status.toLowerCase() &&
                order.consumer === uid) ||
              (tab === "history" &&
                order.status.toLowerCase() === status.toLowerCase() &&
                order.consumer === uid)
          );
          console.log(filteredOrders);
        }

        setOrders(filteredOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchData();
  }, [tab, status]);

  const handleOrderItemClick = (orderId) => {
    // Navigate to order details page with orderId as parameter
    navigate(`/main/order-details/${tab}/${status}/${orderId}`);
  };

  return (
    <div className="h-screen">
      <div className=" flex flex-col">
        <div className="bg-green-700 shadow-md top-0 fixed w-full">
          <div className="flex items-center gap-5 p-3">
            <NavLink to={"/main/profile"} className="">
              <IoMdArrowRoundBack
                fontSize={"25px"}
                className="text-neutral-100"
              />
            </NavLink>
            <h1 className="text-lg text-neutral-100 font-bold">
              {tab.toUpperCase()}
            </h1>
          </div>
        </div>
        <div className="mt-14 bg-neutral-100 ">
          {tab === "delivery" && (
            <div className="flex justify-between gap-3 overflow-x-hidden p-2">
              <button
                className={`text-[0.8em] w-full whitespace-nowrap text-gray-800 p-2 rounded-md flex flex-col items-center justify-between ${
                  status.toLowerCase() === "pending" && "bg-green-200"
                }`}
                onClick={() => setStatus("Pending")}
              >
                <MdDeliveryDining fontSize={"28px"} className=" mx-auto" />
                To Ship
              </button>
              <button
                className={`text-[0.8em] w-full whitespace-nowrap text-gray-800 p-2 rounded-md flex flex-col items-center justify-between ${
                  status.toLowerCase() === "to receive" && "bg-green-200"
                }`}
                onClick={() => setStatus("To Receive")}
              >
                <FaJoget fontSize={"20px"} className=" mx-auto" />
                To Receive
              </button>
              <button
                className={`text-[0.8em] w-full whitespace-nowrap text-gray-800 p-2 rounded-md flex flex-col items-center justify-between ${
                  status.toLowerCase() === "completed" && "bg-green-200"
                }`}
                onClick={() => setStatus("Completed")}
              >
                <FaCheckCircle fontSize={"20px"} className=" mx-auto" />
                Completed
              </button>
              <button
                className={`text-[0.8em] w-full whitespace-nowrap text-gray-800 p-2 rounded-md flex flex-col items-center justify-between ${
                  status.toLowerCase() === "cancelled" && "bg-green-200"
                }`}
                onClick={() => setStatus("Cancelled")}
              >
                <FiMinusCircle fontSize={"20px"} className=" mx-auto" />
                Cancelled
              </button>
            </div>
          )}
          {tab === "pickup" && (
            <div className="flex justify-between gap-3 overflow-x-hidden  p-2">
              <button
                className={`text-[0.8em] w-full whitespace-nowrap text-gray-800 p-2 rounded-md flex flex-col items-center justify-between ${
                  status.toLowerCase() === "pending" && "bg-green-200"
                }`}
                onClick={() => setStatus("Pending")}
              >
                <FaBoxOpen fontSize={"25px"} className=" mx-auto my-0.5" />
                To Pack
              </button>
              <button
                className={`text-[0.8em] w-full whitespace-nowrap text-gray-800 p-2 rounded-md flex flex-col items-center justify-between ${
                  status.toLowerCase() === "to distribute" && "bg-green-200"
                }`}
                onClick={() => setStatus("To Distribute")}
              >
                <FaBox fontSize={"20px"} className=" mx-auto" />
                To Distribute
              </button>
              <button
                className={`text-[0.8em] w-full whitespace-nowrap text-gray-800 p-2 rounded-md flex flex-col items-center justify-between ${
                  status.toLowerCase() === "completed" && "bg-green-200"
                }`}
                onClick={() => setStatus("Completed")}
              >
                <FaCheckCircle fontSize={"20px"} className=" mx-auto" />
                Completed
              </button>
              <button
                className={`text-[0.8em] w-full whitespace-nowrap text-gray-800 p-2 rounded-md flex flex-col items-center justify-between ${
                  status.toLowerCase() === "cancelled" && "bg-green-200"
                }`}
                onClick={() => setStatus("Cancelled")}
              >
                <FiMinusCircle fontSize={"20px"} className=" mx-auto" />
                Cancelled
              </button>
            </div>
          )}
          {tab === "history" && (
            <div className="flex justify-between gap-3 overflow-x-hidden  p-2">
              <button
                className={`text-[0.8em] w-full whitespace-nowrap text-gray-800 p-2 rounded-md flex flex-col items-center justify-between ${
                  status.toLowerCase() === "completed" && "bg-green-200"
                }`}
                onClick={() => setStatus("Completed")}
              >
                <FaCheckCircle fontSize={"20px"} className=" mx-auto my-0.5" />
                Completed
              </button>
              <button
                className={`text-[0.8em] w-full whitespace-nowrap text-gray-800 p-2 rounded-md flex flex-col items-center justify-between ${
                  status.toLowerCase() === "cancelled" && "bg-green-200"
                }`}
                onClick={() => setStatus("Cancelled")}
              >
                <FiMinusCircle fontSize={"20px"} className=" mx-auto" />
                Cancelled
              </button>
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="overflow-y-auto space-y-3 mb-20 p-3 md:px-10">
            {/* Display orders */}

            {orders &&
              orders.map((order) => (
                <div
                  key={order.receiptId}
                  className="p-4 border-b cursor-pointer border rounded-md shadow-md"
                  onClick={() => handleOrderItemClick(order.receiptId)}
                >
                  <h2 className="text-[0.7em] font-semibold">
                    Order ID: {order.receiptId}
                  </h2>
                  <p>Status: {order.status}</p>
                  <p>Date: {order.date}</p>
                </div>
              ))}
            <div className="mb-20 p-2 h-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
