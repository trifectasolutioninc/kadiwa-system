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
import { MdPending } from "react-icons/md";
import {
  ref,
  getDatabase,
  orderByChild,
  equalTo,
  get,
  off,
  onValue,
} from "firebase/database";
import { MdDeliveryDining } from "react-icons/md";
import { imageConfig } from "../Configuration/config-file";

const Orders = () => {
  const { tab, getstatus } = useParams();
  const uid = sessionStorage.getItem("uid");
  const [status, setStatus] = useState(getstatus);
  const [deliveryPendingOrdersCount, setDeliveryPendingOrdersCount] =
    useState(0);
  const [pickupPendingOrdersCount, setPickupPendingOrdersCount] = useState(0);
  const [toShipOrdersCount, setToShipOrdersCount] = useState(0);
  const [toPackOrdersCount, setToPackOrdersCount] = useState(0);
  const [toRecieveOrdersCount, setToRecieveOrdersCount] = useState(0);
  const [toDistributeOrdersCount, setToDistributeOrdersCount] = useState(0);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const database = getDatabase();
    const ordersRef = ref(database, "orders_list");

    const fetchPendingOrdersCount = async () => {
      try {
        // Fetch initial pending orders count
        let count = 0;
        let count1 = 0;
        let count2 = 0;
        let count3 = 0;
        let count4 = 0;
        let count5 = 0;
        const ordersSnapshot = await get(ordersRef);
        ordersSnapshot.forEach((order) => {
          const orderData = order.val();
          if (
            orderData.consumer === uid &&
            orderData.status === "Pending" &&
            orderData.shippingOption === "Delivery"
          ) {
            count++;
          }
          if (
            orderData.consumer === uid &&
            orderData.status === "Pending" &&
            orderData.shippingOption === "Pickup"
          ) {
            count1++;
          }
          if (orderData.consumer === uid && orderData.status === "To Ship") {
            count2++;
          }
          if (orderData.consumer === uid && orderData.status === "To Pack") {
            count3++;
          }
          if (
            orderData.consumer === uid &&
            orderData.status === "To Distribute"
          ) {
            count4++;
          }
          if (orderData.consumer === uid && orderData.status === "To Receive") {
            count5++;
          }
        });
        setDeliveryPendingOrdersCount(count);
        setPickupPendingOrdersCount(count1);
        setToShipOrdersCount(count2);
        setToPackOrdersCount(count3);
        setToDistributeOrdersCount(count4);
        setToRecieveOrdersCount(count5);

        // Fetch initial cart count
        // let cart = 0;
        // const cartsSnapshot = await get(cartsRef);
        // cartsSnapshot.forEach((cartlist) => {
        //   const cartData = cartlist.val();
        //   if (cartData.consumer_id === connect && cartData.CartList) {
        //     const cartItems = cartData.CartList;
        //     const itemCount = Object.keys(cartItems).length;
        //     cart += itemCount;
        //   }
        // });
        // setCartCount(cart);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchPendingOrdersCount();

    // Set up real-time listeners
    const ordersListener = onValue(ordersRef, () => {
      fetchPendingOrdersCount();
    });

    // Clean up listeners
    return () => {
      off(ordersRef, "value", ordersListener);
    };
  }, [uid]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getDatabase();
        const ordersRef = ref(db, "orders_list");

        const snapshot = await get(ordersRef);
        let filteredOrders = [];

        if (snapshot.exists()) {
          const ordersData = snapshot.val();

          filteredOrders = Object.values(ordersData).filter(
            (order) =>
              (order.shippingOption.toLowerCase() === tab &&
                order.status.toLowerCase() === status.toLowerCase() &&
                order.consumer === uid) ||
              (tab === "history" &&
                order.status.toLowerCase() === status.toLowerCase() &&
                order.consumer === uid)
          );

          // Sort orders based on the date in descending order
          filteredOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
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
            <div className="flex justify-between gap-3  overflow-x-auto sm:overflow-x-auto md:overflow-x-hidden p-2">
              <button
                className={`relative text-[0.8em] w-full whitespace-nowrap text-gray-800 p-2 rounded-md flex flex-col items-center justify-between ${
                  status.toLowerCase() === "pending" && "bg-green-200"
                }`}
                onClick={() => setStatus("Pending")}
              >
                <MdPending fontSize={"28px"} className=" mx-auto" />
                New
                {deliveryPendingOrdersCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-700 text-white px-2 py-0.5 rounded-full text-[0.8em]">
                    {deliveryPendingOrdersCount}
                  </span>
                )}
              </button>
              <button
                className={`relative text-[0.8em] w-full whitespace-nowrap text-gray-800 p-2 rounded-md flex flex-col items-center justify-between ${
                  status.toLowerCase() === "to ship" && "bg-green-200"
                }`}
                onClick={() => setStatus("To Ship")}
              >
                <MdDeliveryDining fontSize={"28px"} className=" mx-auto" />
                To Ship
                {toShipOrdersCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-700 text-white px-2 py-0.5 rounded-full text-[0.8em]">
                    {toShipOrdersCount}
                  </span>
                )}
              </button>
              <button
                className={`relative text-[0.8em] w-full whitespace-nowrap text-gray-800 p-2 rounded-md flex flex-col items-center justify-between ${
                  status.toLowerCase() === "to receive" && "bg-green-200"
                }`}
                onClick={() => setStatus("To Receive")}
              >
                <FaJoget fontSize={"20px"} className=" mx-auto" />
                To Receive
                {toRecieveOrdersCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-700 text-white px-2 py-0.5 rounded-full text-[0.8em]">
                    {toRecieveOrdersCount}
                  </span>
                )}
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
            <div className="flex justify-between gap-3 overflow-x-auto sm:overflow-x-auto md:overflow-x-hidden p-2">
              <button
                className={`relative text-[0.8em] w-full whitespace-nowrap text-gray-800 p-2 rounded-md flex flex-col items-center justify-between ${
                  status.toLowerCase() === "pending" && "bg-green-200"
                }`}
                onClick={() => setStatus("Pending")}
              >
                <MdPending fontSize={"25px"} className=" mx-auto my-0.5" />
                New
                {pickupPendingOrdersCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-700 text-white px-2 py-0.5 rounded-full text-[0.8em]">
                    {pickupPendingOrdersCount}
                  </span>
                )}
              </button>
              <button
                className={`relative text-[0.8em] w-full whitespace-nowrap text-gray-800 p-2 rounded-md flex flex-col items-center justify-between ${
                  status.toLowerCase() === "to pack" && "bg-green-200"
                }`}
                onClick={() => setStatus("To Pack")}
              >
                <FaBoxOpen fontSize={"25px"} className=" mx-auto my-0.5" />
                To Pack
                {toPackOrdersCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-700 text-white px-2 py-0.5 rounded-full text-[0.8em]">
                    {toPackOrdersCount}
                  </span>
                )}
              </button>
              <button
                className={`relative text-[0.8em] w-full whitespace-nowrap text-gray-800 p-2 rounded-md flex flex-col items-center justify-between ${
                  status.toLowerCase() === "to distribute" && "bg-green-200"
                }`}
                onClick={() => setStatus("To Distribute")}
              >
                <FaBox fontSize={"20px"} className=" mx-auto" />
                To Distribute
                {toDistributeOrdersCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-700 text-white px-2 py-0.5 rounded-full text-[0.8em]">
                    {toDistributeOrdersCount}
                  </span>
                )}
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
                  className=" p-2 cursor-pointer border bg-slate-50 rounded-md shadow-md space-y-3 text-black/80 "
                  onClick={() => handleOrderItemClick(order.receiptId)}
                >
                  <div className="grid grid-cols-10 ">
                    <div
                      className={`col-span-3 ${
                        order.items.length === 1
                          ? "flex items-center"
                          : "grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-0 items-center"
                      }`}
                    >
                      {order.items.slice(0, 4).map((item, index) => (
                        <div
                          key={index}
                          className={`${
                            order.items.length !== 1
                              ? "flex justify-center"
                              : ""
                          }`}
                        >
                          <img
                            src={imageConfig[item.productInfo.keywords]}
                            className={`rounded-md ${
                              order.items.length !== 1
                                ? "max-h-32"
                                : "bg-cover max-h-32"
                            }`}
                            alt={`Item ${index + 1}`}
                          />
                        </div>
                      ))}
                    </div>

                    <div className=" col-span-7 px-4">
                      {/* Display keywords */}
                      <div className="flex flex-wrap gap-1 mb-1">
                        {order.items.slice(0, 4).map((item, index) => (
                          <span
                            key={index}
                            className="bg-gray-200 text-gray-800 px-2 py-1 rounded-md text-xs"
                          >
                            {item.productInfo.product_name}
                          </span>
                        ))}
                        {order.items.length > 4 && (
                          <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-md text-xs">
                            More...
                          </span>
                        )}
                      </div>

                      <hr />
                      <div className=" ">
                        <h1 className=" ">
                          <span className=" font-bold text-xs">ORDER ID: </span>
                          <span className=" font-semibold text-xs">
                            {order.receiptId}
                          </span>
                        </h1>
                        <p>
                          <span className=" text-xs font-bold mr-1">
                            Status:
                          </span>
                          <span
                            className={`px-3 py-1 text-xs rounded-full font-medium ${
                              order.status === "Pending"
                                ? "bg-yellow-200 text-yellow-900"
                                : order.status === "Processing" ||
                                  order.status === "To Pack"
                                ? "bg-sky-200 text-sky-900"
                                : order.status === "Shipped" ||
                                  order.status === "To Ship"
                                ? "bg-blue-200 text-blue-900"
                                : order.status === "Delivered" ||
                                  order.status === "To Receive" ||
                                  order.status === "To Distribute"
                                ? "bg-green-200 text-green-900"
                                : order.status === "Cancelled"
                                ? "bg-red-200 text-red-900"
                                : "bg-gray-500 text-white"
                            }`}
                          >
                            {order.status}
                          </span>
                        </p>
                        <p className=" ">
                          <span className=" text-xs font-bold mr-1">Date:</span>
                          <span className="text-gray-500 text-xs">
                            {order.date}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
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
