import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";
import { FaStore } from "react-icons/fa";
import { ref, child, get, push, set, onValue, off } from "firebase/database";
import firebaseDB from "../Configuration/config-firebase2";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedItems = location.state.selectedItems;
  const storeNames = location.state.storeNames;
  const path = location.state.path;
  const [paymentOption, setPaymentOption] = useState("Cash");
  const [storeReceiptGenerator, setStoreReceiptGenerator] = useState(null);
  const uid = sessionStorage.getItem("uid");

  useEffect(() => {
    const fetchStoreReceiptGenerator = async () => {
      try {
        const snapshot = await get(ref(firebaseDB, "store_receipt_generator"));
        if (snapshot.exists()) {
          setStoreReceiptGenerator(snapshot.val());
          console.log(
            "storeReceiptGenerator fetched successfully:",
            snapshot.val()
          );
        } else {
          console.error("store_receipt_generator data not found in Firebase.");
        }
      } catch (error) {
        console.error(
          "Error fetching store_receipt_generator data from Firebase:",
          error
        );
      }
    };

    fetchStoreReceiptGenerator();
  }, []);

  // Group items by store key
  const groupedItems = selectedItems.reduce((acc, item) => {
    if (!acc[item.storeKey]) {
      acc[item.storeKey] = [];
    }
    acc[item.storeKey].push(item);
    return acc;
  }, {});

  // Initialize shipping option state for each store
  const [shippingOptions, setShippingOptions] = useState(() => {
    const initialOptions = {};
    Object.keys(groupedItems).forEach((storeKey) => {
      initialOptions[storeKey] = "Delivery";
    });
    return initialOptions;
  });

  // Calculate total price for items in a store
  const calculateTotalPrice = (items) => {
    const totalPrice = items.reduce((acc, item) => {
      return acc + item.productInfo.price * item.productInfo.qty;
    }, 0);
    return totalPrice;
  };

  // Calculate shipping cost based on selected option
  const calculateShippingCost = (option) => {
    return option === "Delivery" ? 58 : 0;
  };

  // Calculate total price including shipping for a store
  const calculateTotalPriceWithShipping = (items, option) => {
    return calculateTotalPrice(items) + calculateShippingCost(option);
  };

  // Handle change in shipping option for a store
  const handleShippingOptionChange = (storeKey, option) => {
    setShippingOptions((prevOptions) => ({
      ...prevOptions,
      [storeKey]: option,
    }));
  };

  // Calculate merchandise subtotal
  const merchandiseSubtotal = Object.values(groupedItems).reduce(
    (acc, items) => {
      return acc + calculateTotalPrice(items);
    },
    0
  );

  // Calculate shipping subtotal
  const shippingSubtotal = Object.entries(shippingOptions).reduce(
    (acc, [storeKey, option]) => {
      return acc + calculateShippingCost(option);
    },
    0
  );

  // Calculate total payment
  const totalPayment = merchandiseSubtotal + shippingSubtotal;

  const generateTransactionCode = () => {
    const currentDate3 = new Date();
    const year = currentDate3.getFullYear();
    const month = String(currentDate3.getMonth() + 1).padStart(2, "0"); // Adding leading zero if needed
    const day = String(currentDate3.getDate()).padStart(2, "0"); // Adding leading zero if needed
    const hours = String(currentDate3.getHours()).padStart(2, "0"); // Adding leading zero if needed
    const minutes = String(currentDate3.getMinutes()).padStart(2, "0"); // Adding leading zero if needed
    const seconds = String(currentDate3.getSeconds()).padStart(2, "0"); // Adding leading zero if needed

    // Generate random characters
    const randomChars = [...Array(10)]
      .map(() => Math.random().toString(36)[2])
      .join("");

    // Concatenate all parts to form the transaction code
    const transactionCode = `${year}${month}${day}${hours}${minutes}${seconds}-${randomChars.toUpperCase()}`;

    return transactionCode;
  };

  const placeOrder = () => {
    if (!storeReceiptGenerator) {
      console.error("storeReceiptGenerator is not fetched yet.");
      return;
    }

    const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const currentDate2 = new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "/");

    Object.entries(groupedItems).forEach(([storeKey, items]) => {
      // Check if storeReceiptGenerator has data for the current storeKey
      if (!storeReceiptGenerator[storeKey.split("_")[1]]) {
        console.error(
          `storeReceiptGenerator data not found for storeKey: ${storeKey}`
        );
        return;
      }

      // Get store receipt generator data for the current storeKey
      const storeReceiptGeneratorData =
        storeReceiptGenerator[storeKey.split("_")[1]];
      if (
        !storeReceiptGeneratorData ||
        typeof storeReceiptGeneratorData !== "object"
      ) {
        console.error(
          `Invalid storeReceiptGenerator data for storeKey: ${
            storeKey.split("_")[1]
          }`
        );
        return;
      }

      let perDayCount = storeReceiptGeneratorData.per_day_count;
      let receiptTotal = storeReceiptGeneratorData.receipt_total;
      let latestDate = storeReceiptGeneratorData.latest_date;
      let receiptId;

      // Check if it's the same day as the latest date
      if (latestDate === currentDate) {
        perDayCount += 1; // Increment per day count
      } else {
        perDayCount = 1; // Reset per day count
        latestDate = currentDate; // Update latest date
      }

      // Construct receipt ID using storeKey, current date, and per day count
      receiptId = `${storeKey.split("_")[1]}-${currentDate}-${perDayCount}`;

      // Update store receipt generator data
      storeReceiptGenerator[storeKey.split("_")[1]] = {
        ...storeReceiptGeneratorData,
        per_day_count: perDayCount,
        latest_date: latestDate,
      };

      // Update receipt total (if needed)
      receiptTotal += 1; // Increment receipt total

      // Get a reference to the 'orders_list' node for the specific store in the Firebase database
      const storeOrdersRef = ref(firebaseDB, `orders_list/${receiptId}`);

      const orderData = {
        store_id: storeKey.split("_")[1],
        items: items,
        shippingOption: shippingOptions[storeKey],
        paymentOption: paymentOption,
        totalPayment: calculateTotalPriceWithShipping(
          items,
          shippingOptions[storeKey]
        ),
        subtotalrevenue: calculateTotalPrice(items),
        status: "Pending",
        consumer: uid,
        shippingOption_price: calculateShippingCost(shippingOptions[storeKey]),
        receiptId: receiptId,
        date: currentDate2, // Include current date in orderData
        date_received: "N/A",
        transaction_code: generateTransactionCode(),
      };

      // Set the order data to Firebase with the receiptId as the key
      set(storeOrdersRef, orderData)
        .then(() => {
          console.log(`Order for store ${storeKey} placed successfully!`);
          navigate(path);
        })
        .catch((error) => {
          console.error(`Error placing order for store ${storeKey}:`, error);
        });

      // Update store receipt generator data in the Firebase database
      set(
        ref(firebaseDB, `store_receipt_generator/${storeKey.split("_")[1]}`),
        {
          ...storeReceiptGeneratorData,
          per_day_count: perDayCount,
          latest_date: latestDate,
          receipt_total: receiptTotal,
        }
      )
        .then(() => {
          console.log(
            `Store receipt generator data updated for store ${
              storeKey.split("_")[1]
            }`
          );
        })
        .catch((error) => {
          console.error(
            `Error updating store receipt generator data for store ${
              storeKey.split("_")[1]
            }:`,
            error
          );
        });
    });
  };

  return (
    <>
      <div className="p-5 md:px-10 mb-28">
        <div className="fixed flex items-center gap-5 bg-white w-full top-0 p-3 right-0 left-0">
          <NavLink to={path}>
            <IoMdArrowRoundBack fontSize={"25px"} />
          </NavLink>
          <h1 className="text-xl font-bold  text-green-700">Checkout</h1>
        </div>
        <div className="space-y-5 mt-12">
          <div className="p-3 bg-white space-y-2 rounded-md shadow-md text-black/80">
            <div className="flex items-center justify-between">
              <p className="text-lg flex items-center font-bold">
                <FaLocationDot fontSize={"12px"} /> Delivery Address
              </p>
              <button className="text-blue-400">Change Address</button>
            </div>
            <hr />
            <p>Juan Dela Cruz | (+63) 900 000 0001</p>
            <p>Juan Street</p>
            <p>Coloong 1, Valenzuela, Metro Manila, 1445 </p>
          </div>

          {Object.entries(groupedItems).map(([storeKey, items]) => (
            <div
              key={storeKey}
              className="mb-4 shadow-lg bg-gray-100 rounded-md text-black/80"
            >
              <h1 className="p-2 font-bold  text-green-600  flex items-center">
                <FaStore fontSize={"12px"} />
                {storeNames[storeKey]}
              </h1>
              {/* Updated line to display store name */}
              <div className="bg-white rounded shadow-md">
                <ul>
                  {items.map((item, index) => (
                    <li
                      key={index}
                      className="border-b border-gray-200 p-4 flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-bold mb-2">
                          {item.productInfo.product_name}
                        </p>
                        <p className="text-gray-600 text-xs">
                          <span className="font-bold">Product ID:</span>{" "}
                          {item.productId}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-xs">
                          <span className="font-bold">Price:</span> ₱
                          {item.productInfo.price}
                        </p>
                        <p className="text-gray-600 text-xs">
                          <span className="font-bold">Quantity:</span>{" "}
                          {item.productInfo.qty}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="p-4 bg-gray-100 flex justify-between items-center">
                  <div>
                    <label
                      htmlFor={`shipping-option-${storeKey}`}
                      className="font-bold  mr-2 text-sm"
                    >
                      Shipping:
                    </label>
                    <select
                      id={`shipping-option-${storeKey}`}
                      className="px-2 py-1 border border-gray-300 rounded"
                      value={shippingOptions[storeKey]}
                      onChange={(e) =>
                        handleShippingOptionChange(storeKey, e.target.value)
                      }
                    >
                      <option value="Delivery">Delivery (+₱58)</option>
                      <option value="Pickup">Pickup (Free)</option>
                    </select>
                  </div>
                  <p className="text-sm font-bold ">
                    Total: ₱
                    {calculateTotalPriceWithShipping(
                      items,
                      shippingOptions[storeKey]
                    ).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div className="p-3 flex items-center justify-between bg-white shadow-md rounded-md text-black/80">
            <label htmlFor="payment-option" className="font-bold text-black/80">
              Payment Option:
            </label>
            <select
              id="payment-option"
              className="p-2 border border-gray-300 rounded"
              value={paymentOption}
              onChange={(e) => setPaymentOption(e.target.value)}
            >
              <option value="Cash">Cash</option>
              <option value="Kadiwa Card">Kadiwa Card</option>
              <option value="Megapay">Megapay</option>
              <option value="Gcash">Gcash</option>
              <option value="Maya">Maya</option>
              <option value="Card">Card</option>
            </select>
          </div>
          <div className="bg-white text-black/80 p-3 rounded-md shadow-md">
            <p className="font-bold">Payment Details:</p>
            <div className="mt-5 flex justify-between ">
              <span>Merchandise Subtotal</span>
              <span> ₱{merchandiseSubtotal.toFixed(2)}</span>
            </div>
            <div className="mb-5  flex justify-between ">
              <span>Shipping Subtotal</span>
              <span> ₱{shippingSubtotal.toFixed(2)}</span>
            </div>
            <div className=" font-bold  flex justify-between ">
              <span className="">Total Payment</span>
              <span> ₱{totalPayment.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-3 w-full fixed bottom-0 bg-white p-2">
        <div className="">
          <p className="text-black/80">Total Payment</p>
          <p className="text-green-700 font-bold ">
            ₱{totalPayment.toFixed(2)}
          </p>
        </div>
        <button
          className="p-3 rounded-md bg-red-500 text-white"
          onClick={placeOrder}
        >
          Place Order
        </button>
      </div>
    </>
  );
};

export default Checkout;
