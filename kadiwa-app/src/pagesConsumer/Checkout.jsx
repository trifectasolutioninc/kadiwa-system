import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";
import { FaStore } from "react-icons/fa";
import { ref, child, get, update, set, remove } from "firebase/database";
import firebaseDB from "../Configuration/config-firebase2";
import SelectedAddressModal from "./Profile/SelectedAddress";
import IncompleteAddressModal from "../Components/Notifications/AddressModal";

// Define Modal component
const Modal = ({ isOpen, onClose, isSuccess, onConfirm }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto">
          <div
            className="fixed inset-0 bg-gray-700 opacity-70 blur-sm"
            onClick={onClose}
          ></div>
          <div className="relative w-full max-w-lg mx-auto my-6">
            <div className="relative mx-5 flex flex-col bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
              <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-blueGray-200">
                <h3 className="text-3xl font-semibold">
                  {isSuccess
                    ? "Order Placed Successfully"
                    : "Order Placement Failed"}
                </h3>
                <button
                  className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                  onClick={onClose}
                >
                  <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                    ×
                  </span>
                </button>
              </div>
              <div className="relative p-6 flex-auto">
                {isSuccess ? (
                  <p>Your order has been successfully placed.</p>
                ) : (
                  <p>
                    There was an error while placing your order. Please try
                    again.
                  </p>
                )}
              </div>
              <div className="flex items-center justify-end p-6 border-t border-solid rounded-b border-blueGray-200">
                <button
                  className="text-white bg-green-500 font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 rounded"
                  type="button"
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedItems = location.state.selectedItems;
  const storeNames = location.state.storeNames;
  const path = location.state.path;
  const [paymentOption, setPaymentOption] = useState("Cash");
  const [storeReceiptGenerator, setStoreReceiptGenerator] = useState(null);
  const uid = sessionStorage.getItem("uid");
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({});
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contactPerson, setContactPerson] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isIncompleteAddressModalOpen, setIsIncompleteAddressModalOpen] =
    useState(false);
  const [incompleteAddressModalContent, setIncompleteAddressModalContent] =
    useState({});
  const [isSelectAddressModalOpen, setIsSelectAddressModalOpen] =
    useState(false);
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

  useEffect(() => {
    const fetchDefaultAddress = async () => {
      try {
        const uid = sessionStorage.getItem("uid");
        const addressesRef = ref(firebaseDB, "users_address");

        // Fetch default address
        const snapshot = await get(child(addressesRef, uid, "default"));
        const defaultAddressFromFirebase = snapshot.val();
        const selectedAdd = defaultAddressFromFirebase.default;
        console.log(
          "Default Address from Firebase:",
          defaultAddressFromFirebase
        );
        console.log("Selected Address from Firebase:", selectedAdd); // Add this log

        if (defaultAddressFromFirebase) {
          setDefaultAddress(defaultAddressFromFirebase);
          setSelectedAddress(selectedAdd); // Set default address initially
        }
      } catch (error) {
        console.error("Error fetching default address:", error);
      }
    };

    fetchDefaultAddress();
  }, []);

  const handleAddressSelect = (address, contactPerson, phoneNumber) => {
    setSelectedAddress(address);
    setIsModalOpen(false); // Close the modal after selecting an address
    setContactPerson(contactPerson);
    setPhoneNumber(phoneNumber);
    console.log("Selected Address:", address);
    console.log("Contact Person:", contactPerson);
    console.log("Phone Number:", phoneNumber);
  };

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

  const handleCloseIncompleteAddressModal = () => {
    setIsIncompleteAddressModalOpen(false);
  };

  const handleOpenSelectedAddressModal = () => {
    setIsIncompleteAddressModalOpen(false);
    setIsModalOpen(true);
  };

  const placeOrder = async () => {
    if (!storeReceiptGenerator) {
      console.error("storeReceiptGenerator is not fetched yet.");
      return;
    }

    if (
      !selectedAddress ||
      selectedAddress.display_name === "N/A" ||
      selectedAddress.display_name === "No Address" ||
      selectedAddress.barangay === "N/A" ||
      selectedAddress.barangay === "No Address"
    ) {
      // If delivery address is incomplete, show modal
      setIsIncompleteAddressModalOpen(true);
      setIncompleteAddressModalContent({
        title: "Incomplete Address",
        message: "Please provide complete address.",
      });
      return;
    }

    const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const currentDate2 = new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "/");

    Object.entries(groupedItems).forEach(async ([storeKey, items]) => {
      // Check if storeReceiptGenerator has data for the current storeKey
      if (!storeReceiptGenerator[storeKey.split("_")[1]]) {
        console.error(
          `storeReceiptGenerator data not found for storeKey: ${storeKey}`
        );
        return;
      }

      console.log("STORE KEY", storeKey);

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
        date_accept: "N/A",
        date_ready: "N/A",
        date_cancel: "N/A",
        deliveryAddress: {
          person: (selectedAddress?.person || contactPerson),
          contact: (selectedAddress?.contact || phoneNumber),
          fulladdress: (selectedAddress?.display_name || "N/A"),
          landbank: (selectedAddress?.landmark || "N/A"),
          barangay: (selectedAddress?.barangay || "N/A"),
          city: (selectedAddress?.city || "N/A"),
          zipcode: (selectedAddress?.zipcode || "N/A"),
          region: (selectedAddress?.region || "N/A"),
        },
        transaction_code: generateTransactionCode(),
      };

      // Check if any item in the CartList has only one item
      const cartListRef = ref(
        firebaseDB,
        `cart_collection/${storeKey}/CartList`
      );
      const onecartListRef = ref(firebaseDB, `cart_collection/${storeKey}`);
      const cartListSnapshot = await get(cartListRef);
      if (
        cartListSnapshot.exists() &&
        Object.keys(cartListSnapshot.val()).length === items.length
      ) {
        // Delete the entire CartList
        remove(onecartListRef)
          .then(() => {
            setShowModal(true);
            setModalContent({ isSuccess: true }); // Indicate success
            console.log(`Cart for store ${storeKey} deleted successfully!`);
          })
          .catch((error) => {
            setShowModal(true);
            setModalContent({ isSuccess: false });
            console.error(`Error deleting cart for store ${storeKey}:`, error);
          });

        set(storeOrdersRef, orderData)
          .then(() => {
            console.log(`Order for store ${storeKey} placed successfully!`);
            // Remove items from the cart
            const updates = {};
            for (const item of items) {
              updates[
                `cart_collection/${storeKey}/CartList/${item.productId}`
              ] = null;
            }
            // Apply all updates to the database in a single transaction
            update(ref(firebaseDB), updates)
              .then(() => {
                console.log("Items removed from the cart successfully!");
                setShowModal(true);
                setModalContent({ isSuccess: true }); // Indicate success
              })
              .catch((error) => {
                console.error("Error removing items from the cart:", error);
                setShowModal(true);
                setModalContent({ isSuccess: false });
              });
          })
          .catch((error) => {
            console.error(`Error placing order for store ${storeKey}:`, error);
            // Inside .catch of set(storeOrdersRef, orderData)
            setShowModal(true);
            setModalContent({ isSuccess: false });
          });
      } else {
        // Proceed with individual items
        // Set the order data to Firebase with the receiptId as the key
        set(storeOrdersRef, orderData)
          .then(() => {
            console.log(`Order for store ${storeKey} placed successfully!`);
            // Remove items from the cart
            const updates = {};
            for (const item of items) {
              updates[
                `cart_collection/${storeKey}/CartList/${item.productId}`
              ] = null;
            }
            // Apply all updates to the database in a single transaction
            update(ref(firebaseDB), updates)
              .then(() => {
                console.log("Items removed from the cart successfully!");
                setShowModal(true);
                setModalContent({ isSuccess: true }); // Indicate success
              })
              .catch((error) => {
                console.error("Error removing items from the cart:", error);
                setShowModal(true);
                setModalContent({ isSuccess: false });
              });
          })
          .catch((error) => {
            console.error(`Error placing order for store ${storeKey}:`, error);
            // Inside .catch of set(storeOrdersRef, orderData)
            setShowModal(true);
            setModalContent({ isSuccess: false });
          });
      }

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
        <div className="fixed flex items-center gap-5 bg-green-700 w-full top-0 p-3 right-0 left-0">
          <NavLink to={path}>
            <IoMdArrowRoundBack
              fontSize={"25px"}
              className="text-neutral-100"
            />
          </NavLink>
          <h1 className="text-xl font-bold  text-neutral-100">Checkout</h1>
        </div>
        <div className="space-y-5 mt-12">
          <div className="p-3 bg-white space-y-2 rounded-md shadow-md text-black/80">
            <div className="flex items-center justify-between">
              <p className="text-lg flex items-center font-bold">
                <FaLocationDot fontSize={"12px"} /> Delivery Address
              </p>
              <button
                className="text-blue-400"
                onClick={() => setIsModalOpen(true)}
              >
                Change Address
              </button>
            </div>
            <hr />
            {selectedAddress ? (
              <>
                <p>
                  {selectedAddress?.person || contactPerson} |{" "}
                  {selectedAddress?.contact || phoneNumber}
                </p>
                <p>
                  {selectedAddress?.landmark || selectedAddress.display_name}
                </p>
                <p>
                  {selectedAddress?.barangay
                    ? `${selectedAddress.barangay}, `
                    : ""}
                  {selectedAddress?.city ? `${selectedAddress.city}, ` : ""}{" "}
                  {selectedAddress?.zipcode
                    ? `${selectedAddress.zipcode}, `
                    : ""}
                </p>
              </>
            ) : (
              <p>No address selected</p>
            )}
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
              <option value="Kadiwa QR">Kadiwa QR</option>
              <option value="Kadiwa Card">Kadiwa Card</option>
              <option value="Megapay">Megapay</option>
              <option value="Gcash">Gcash</option>
              <option value="Maya">Maya</option>
              <option value="Bank">Bank</option>
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
      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        isSuccess={modalContent.isSuccess}
        onConfirm={() => navigate(path)}
      />

      <SelectedAddressModal
        showModal={isModalOpen}
        closeModal={() => setIsModalOpen(false)}
        handleAddressSelect={handleAddressSelect}
        defaultAddress={defaultAddress}
        additionalAddresses={defaultAddress ? defaultAddress.additional : []}
        selectedAddress={selectedAddress}
        setSelectedAddress={setSelectedAddress} // Pass the setter function
      />

      <IncompleteAddressModal
        isOpen={isIncompleteAddressModalOpen}
        onClose={handleCloseIncompleteAddressModal}
        content={incompleteAddressModalContent}
        openSelectedAddressModal={handleOpenSelectedAddressModal}
      />
    </>
  );
};

export default Checkout;
