import React, { useEffect, useState, useRef } from "react";
import { useParams, NavLink } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { paymentImg } from "../../Configuration/config-file";
import QRCode from "qrcode";
import { getDatabase, ref, get } from "firebase/database"; // Make sure this is the correct import for Firebase
// Remove the unused Image import

const OrdersData = () => {
  const { tab, status, orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [componentMounted, setComponentMounted] = useState(false);
  const qrCodeCanvasRef = useRef(null);
  const oid = orderId;

  useEffect(() => {
    setComponentMounted(true);
    return () => {
      setComponentMounted(false);
    };
  }, []);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const db = getDatabase();
        const orderRef = ref(db, `orders_list/${oid}`);
        const snapshot = await get(orderRef);

        if (snapshot.exists()) {
          const orderData = snapshot.val();
          setOrder(orderData);

          const transactionCode = orderData.transaction_code;
          const qrText = `${oid}:${transactionCode}:${orderData.status}:${orderData.consumer}`;

          if (qrCodeCanvasRef.current && componentMounted) {
            QRCode.toCanvas(qrCodeCanvasRef.current, qrText, function (error) {
              if (error) {
                console.error("Error generating QR code:", error);
              } else {
                console.log("QR code generated successfully");
              }
            });
          }
        } else {
          console.log("No such order exists");
        }
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };

    fetchOrderData();
  }, [oid, componentMounted]);

  return (
    <>
      <div className="fixed flex items-center gap-5 bg-white w-full top-0 p-3 right-0 left-0 z-10 shadow-md">
        <NavLink to={`/main/orders/${tab}/${status}`}>
          <IoMdArrowRoundBack fontSize={"25px"} />
        </NavLink>
        <h1 className="text-xl text-green-600  font-bold">Store</h1>
      </div>
      <main className="p-3 md:p-10 space-y-5">
        <div className="space-y-5 mt-14 mb-28 border p-4 rounded-md shadow-md">
          {order ? (
            <div className="space-y-3">
              <p className="text-3xl font-semibold opacity-90">Order Details</p>
              <div className="mb-4 flex gap-2 text-[1em] items-center">
                <p>Status</p>
                <p className="text-[0.5em] text-gray-600">⬤</p>
                <p className="text-red-600 font-semibold">{order.status}</p>
                <p className="text-[0.5em] text-gray-600">⬤</p>
                <p> {order.date}</p>
              </div>
              <button className="px-3 py-1 text-sm text-white bg-red-500 rounded-md">
                Cancel Order
              </button>
              {/* Display other order details    */}
              <div className="mt-6 border-t border-gray-200 pt-4">
                <div className="flex gap-2 mb-4">
                  <p className="text-[1em] text-green-800 font-bold">Items</p>
                  <p>|</p>
                  <p className="text-gray-800  bg-green-200 rounded-md w-fit px-2 text-[0.6em] items-center flex gap-1">
                    <span className="font-bold">ORDER ID</span>
                    {orderId}
                  </p>
                </div>
                {order.items.map((item, index) => (
                  <div key={index} className="mb-2 ">
                    <div className=" col-span-7 space-y-2">
                      <p className="font-bold text-[1em] text-black/80">
                        {item.productInfo.product_name}
                      </p>
                      <p className="text-gray-600  bg-gray-200 rounded-md w-fit px-2 text-[0.6em]">
                        {item.productInfo.commodity_type}
                      </p>
                      <div className="text-[0.8em] flex justify-between">
                        <div className=" flex gap-2">
                          <p className="text-black/80">
                            Price: ₱{item.productInfo.price}
                          </p>
                          <p>X {item.productInfo.qty} </p>
                          <p>{item.productInfo.unit_measurement}</p>
                        </div>
                        <div className="flex gap-2">
                          <p className=" ">Subtotal</p>
                          <p className=" font-bold text-gray-700">
                            ₱{item.productInfo.qty * item.productInfo.price}
                          </p>
                        </div>
                      </div>
                      <hr />
                    </div>
                  </div>
                ))}
              </div>
              <div className=" justify-between flex text-black/80">
                <p>Total</p>
                <p className="font-semibold">₱ {order.subtotalrevenue}</p>
              </div>
              <div className=" justify-between flex text-black/80">
                <p>{order.shippingOption}</p>
                <p className="font-semibold">₱ {order.shippingOption_price}</p>
              </div>
              <div className=" justify-between flex font-bold text-black/80">
                <p>Grand Total</p>
                <p>₱{order.totalPayment}</p>
              </div>
              {/* <div className=' h-20'>

                        </div> */}
              <hr />
              <div className="flex justify-between py-4 text-black/80">
                <div>
                  <p> Payment Method</p>
                </div>
                <div className=" flex  justify-center items-center gap-3">
                  {order.paymentOption === "Cash" && (
                    <img
                      src={paymentImg.Cash}
                      alt="Cash"
                      className=" h-[1em]"
                    />
                  )}
                  {order.paymentOption === "Gcash" && (
                    <img
                      src={paymentImg.Gcash}
                      alt="Gcash"
                      className=" h-[1em]"
                    />
                  )}
                  {order.paymentOption === "Megapay" && (
                    <img
                      src={paymentImg.Megapay}
                      alt="Megapay"
                      className=" h-[1em]"
                    />
                  )}
                  {order.paymentOption === "Maya" && (
                    <img
                      src={paymentImg.Maya}
                      alt="Maya"
                      className=" h-[1em]"
                    />
                  )}
                  {order.paymentOption === "Kadiwa Card" && (
                    <img
                      src={paymentImg.KadiwaCard}
                      alt="Kadiwa Card"
                      className=" h-[1em]"
                    />
                  )}
                  {order.paymentOption === "Kadiwa QR" && (
                    <img
                      src={paymentImg.KadiwaQR}
                      alt="Kadiwa QR"
                      className=" h-[1em]"
                    />
                  )}
                  {order.paymentOption === "Bank" && (
                    <img
                      src={paymentImg.Bank}
                      alt="Bank"
                      className=" h-[1em]"
                    />
                  )}
                  <p>{order.paymentOption}</p>
                </div>
              </div>
              <div>
                {order.paymentOption === "Kadiwa QR" && (
                  <div className=" text-center mt-16">
                    <div className="flex justify-center items-center">
                      <div className=" bg-green-600 w-fit p-2 rounded-md">
                        <canvas
                          id="qrCodeCanvas"
                          ref={qrCodeCanvasRef}
                          className="mx-auto"
                        ></canvas>
                      </div>
                    </div>

                    <p className=" font-bold text-gray-800">Reminder!</p>
                    <p>
                      Use this as{" "}
                      <span className="font-semibold text-green-800">
                        Payment Method
                      </span>{" "}
                      and{" "}
                      <span className="font-semibold text-green-800">
                        Verification of transaction
                      </span>
                      .
                    </p>
                  </div>
                )}
                {order.paymentOption !== "Kadiwa QR" && (
                  <div className=" text-center mt-16">
                    <div className="flex justify-center items-center">
                      <div className=" bg-green-600 w-fit p-2 rounded-md">
                        <canvas
                          id="qrCodeCanvas"
                          ref={qrCodeCanvasRef}
                          className="mx-auto"
                        ></canvas>
                      </div>
                    </div>

                    <p className=" font-bold text-gray-800">Reminder!</p>
                    
                    <p>
                      Use this as{" "}
                      <span className="font-semibold text-green-800">
                        Verification of transaction
                      </span>
                      .
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </main>
    </>
  );
};

export default OrdersData;
