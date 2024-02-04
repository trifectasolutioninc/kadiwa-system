import React, { useState, useEffect } from 'react';
import { getDatabase, get, ref, set } from 'firebase/database';
import { IoCloseOutline, IoStorefrontOutline, IoQrCode } from 'react-icons/io5';
import { MdOutlineLocalOffer, MdOutlinePayment } from 'react-icons/md';
import { CiDeliveryTruck } from 'react-icons/ci';
import firebaseDB from '../Configuration/config-firebase2';
import { useZxing } from "react-zxing";
import { useNavigate } from 'react-router-dom';



const QRCodeScanner = ({ onSave, onClose }) => {
  const [result, setResult] = useState("");

  const { ref, error } = useZxing({
    onDecodeResult(decodedResult) {
      setResult(decodedResult.getText());
    },
  });

  useEffect(() => {
    if (error) {
      console.error("Error accessing camera:", error);
    }
  }, [error]);

  const handleError = (error) => {
    console.error("Error accessing camera:", error);
  };

  const handleSave = () => {
    onSave(result);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-white p-4 rounded-md shadow-md relative w-3/4">
        <p className="text-lg font-bold mb-4">Kadiwa QR Scanner</p>
        {error && <p className="text-red-500">Error accessing camera: {error.message}</p>}
        <video
          width="100%"
          height="auto"
          autoPlay
          playsInline
          ref={ref}
          onError={handleError}
        />
        {result && (
          <div>
            <p className="text-green-700">QR Code Scanned Successfully!</p>

            <p>Result: {result}</p>
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-2 py-1 rounded-md mr-2"
            >
              Save
            </button>
          </div>
        )}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md"
        >
          Close
        </button>
      </div>
    </div>
  );
};


const DiscountModal = ({ onClose, onApplyDiscount }) => {
  const [selectedDiscount, setSelectedDiscount] = useState(null);

  const handleApplyDiscount = () => {
    // Apply the selected discount
    onApplyDiscount(selectedDiscount);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-white p-4 rounded-md shadow-md relative w-3/4">
        <p className="text-lg font-bold mb-4">Select Discount</p>
        <select
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
          onChange={(e) => setSelectedDiscount(e.target.value)}
        >
          <option value="senior">Senior (20%)</option>
          <option value="pwd">PWD (20%)</option>
          <option value="both">Both (25%)</option>
        </select>
        <div className="flex justify-end">
          <button
            onClick={handleApplyDiscount}
            className="bg-blue-500 text-white px-2 py-1 rounded-md mr-2"
          >
            Apply
          </button>
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-2 py-1 rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};



const DeliveryModal = ({ onSave, onClose }) => {
  const [fee, setFee] = useState("");

  const handleSave = () => {
    onSave(fee);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-white p-4 rounded-md shadow-md relative w-3/4">
        <p className="text-lg font-bold mb-4">Enter Delivery Fee</p>
        <input
          type="number"
          placeholder="Enter delivery fee"
          value={fee}
          onChange={(e) => setFee(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
        />
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-2 py-1 rounded-md mr-2"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-2 py-1 rounded-md"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};


const ReceiptComponent = () => {
  const kdwconnect = sessionStorage.getItem('kdwconnect');
  const [latestReceiptNo, setLatestReceiptNo] = useState(0);
  const [products, setProducts] = useState([]);
  const [currentDate, setCurrentDate] = useState('');
  const [showQRCodeScanner, setShowQRCodeScanner] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [kadiwaPts, setKadiwaPts] = useState(0);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [grandTotal, setGrandTotal] = useState(0);
  const [storeName, setstoreName] = useState('');
  const [userInfo, setuserInfo] = useState(null);
  const navigate  = useNavigate();

  // Add a function to handle applying the discount
  const handleApplyDiscount = (discountType) => {
    let discountPercentage = 0;
    if (discountType === 'senior' || discountType === 'pwd') {
      discountPercentage = 20;
    } else if (discountType === 'both') {
      discountPercentage = 25;
    }

    const discountedAmount = (calculateTotal() * discountPercentage) / 100;
    setDiscountAmount(discountedAmount.toFixed(2));
  };

  const handleSaveDeliveryFee = (fee) => {
    setDeliveryFee(parseFloat(fee).toFixed(2));
    setShowDeliveryModal(false);
  };




  useEffect(() => {
    const fetchData = async () => {
      if (kdwconnect) {
        const contact = kdwconnect;
        const userDatabaseRef = ref(firebaseDB, `kadiwa_users_account/${contact}`);


        try {
          const userSnapshot = await get(userDatabaseRef);
          const userData = userSnapshot.val();
          setuserInfo(userData);
          const receiptDatabaseRef = ref(firebaseDB, `receipt_collections/${userData.id}`);
          console.log(userData.id);
          if (userData && userData.id) {
            setstoreName(userData.storeName);
            try {
              const receiptSnapshot = await get(receiptDatabaseRef);
              const receiptData = receiptSnapshot.val();



              if (receiptData && receiptData.owner_id) {
                if (userData.id === receiptData.owner_id) {
                  console.log(receiptData.owner_id);
                  console.log('userSnapshot:', userSnapshot);
                  console.log('userData:', userData);
                  console.log('receiptSnapshot:', receiptSnapshot);
                  console.log('receiptData:', receiptData);
                  // Increment the latest_receiptno by 1
                  const updatedReceiptNo = receiptData.latest_receiptno + 1;

                  // Save the updated latest_receiptno to the database
                  try {
                    const latestReceiptRef = ref(firebaseDB, `receipt_collections/${userData.id}/latest_receiptno`);
                    await set(latestReceiptRef, updatedReceiptNo);
                    
                  } catch (error) {
                    console.error('Error setting latest_receiptno:', error);
                  }


                  // Set the latestReceiptNo state to the updated value
                  setLatestReceiptNo(updatedReceiptNo);
                } else {
                  console.error('Receipt data owner_id does not match user id.');
                }
              } else {
                console.error('Receipt data or owner_id not found.');
              }
            } catch (error) {
              console.error('Error fetching receipt data:', error);
            }
          } else {
            console.error('User data not found.');
            return;
          }
        } catch (error) {
          console.error('Error fetching user ID:', error);
        }
      }
    };



    const fetchProducts = async () => {
      const productInventoryRef = ref(firebaseDB, 'product_inventory');

      try {
        const snapshot = await get(productInventoryRef);
        const productsData = snapshot.val();

        if (productsData) {
          const filteredProducts = Object.values(productsData).filter(
            (product) => product.pos_app_qty !== 0
          );

          setProducts(filteredProducts);
        }
      } catch (error) {
        console.error('Error fetching products data:', error);
      }
    };


    const fetchCurrentDate = () => {
      const now = new Date();
      const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
      };
      const formattedDate = now.toLocaleDateString('en-US', options);
      setCurrentDate(formattedDate);
    };

    fetchCurrentDate();
    fetchData();
    fetchProducts();
  }, [kdwconnect]);

  const calculateTotal = () => {
    return products.reduce((total, product) => total + product.pos_app_qty * product.price, 0).toFixed(2);
  };


  const calculateGrandTotal = () => {
    const total = parseFloat(calculateTotal());
    const pointsDiscount = parseFloat(kadiwaPts);
    const appliedDiscount = parseFloat(discountAmount);
    const serviceFee = 0; // Replace with your service fee calculation logic if needed
    const deliveryFeeValue = parseFloat(deliveryFee);

    const grandTotalValue = total - pointsDiscount - appliedDiscount + serviceFee + deliveryFeeValue;

    setGrandTotal(grandTotalValue.toFixed(2));
  };

  useEffect(() => {
    calculateGrandTotal();
  }, [calculateTotal, kadiwaPts, discountAmount, deliveryFee]);


  const handleScan = async (result) => {
    // Handle the scanned QR code result here
    console.log('Scanned QR Code:', result);

    // Fetch the user's points from Firebase based on the contact number
    const userDatabaseRef = ref(firebaseDB, `kadiwa_users_account/${kdwconnect}`);
    try {
      const userSnapshot = await get(userDatabaseRef);
      const userData = userSnapshot.val();
      const kadiwapts = calculateTotal() * 0.1;
      // Check if the scanned points are greater than the user's points
      if (userData.id === result) {

        console.log('Scanned QR Code:', result);
        if (kadiwapts > userData.points) {
          // Display a warning message in the QR modal
          setKadiwaPts(0); // Reset displayed points
          setShowQRCodeScanner(false); // Close the scanner modal
          setShowWarningModal(true);
          return;
        }


      }




      // Update the displayed Kadiwa Points
      setKadiwaPts(kadiwapts);

      // You may want to perform any specific actions based on the scanned result

    } catch (error) {
      console.error('Error fetching user data:', error);
      // Handle error fetching user data
    }

    setShowQRCodeScanner(false); // Close the scanner modal after a successful scan
  };


  const WarningModal = ({ onClose }) => {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
        <div className="bg-white p-4 rounded-md shadow-md relative w-3/4">
          <p className="text-lg font-bold mb-4 text-red-600">Warning!</p>
          <p className="text-gray-700 mb-4">
            Kadiwa PTS can only be used for purchases of P200 and above.
          </p>
          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:border-red-700 focus:ring focus:ring-red-200"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  const handleDecrementReceiptNo = async () => {
    try {
      // Decrement the latest_receiptno by 1
      const updatedReceiptNo = latestReceiptNo - 1;

      // Save the updated latest_receiptno to the database
      const latestReceiptRef = ref(firebaseDB, `receipt_collections/${userInfo.id}/latest_receiptno`);
      await set(latestReceiptRef, updatedReceiptNo);

      // Set the latestReceiptNo state to the updated value
      setLatestReceiptNo(updatedReceiptNo);

      // Navigate back to /pos/home
      navigate('/pos/home');
    } catch (error) {
      console.error('Error decrementing latest_receiptno:', error);
    }
  };


  return (
    <div>
      <div className="flex justify-around bg-white shadow-md items-center py-8">
      <IoCloseOutline size="17px" onClick={handleDecrementReceiptNo} />
        <div className="flex text-center justify-center">
          <IoStorefrontOutline size="17px" />
          <h2 className="text-xs font-bold">{storeName}</h2>
        </div>
        <p className="text-xs text-gray-600">Receipt No.: {latestReceiptNo}</p>
      </div>
      <div className="grid grid-cols-4 gap-4 bg-gray-100 mt-1 text-gray-800">
        <div className="text-center">
          <p className="text-xs font-bold">Product</p>
        </div>
        <div className="text-center items-center">
          <p className="text-xs font-bold">Quantity</p>
        </div>
        <div className="text-center items-center">
          <p className="text-xs font-bold">Price</p>
        </div>
        <div className="text-center items-center">
          <p className="text-xs font-bold">Subtotal</p>
        </div>

        {products.map((product) => (
          <React.Fragment key={product.id}>
            <div className="text-center items-center">
              <p className="text-xs">{product.product_name}</p>
            </div>
            <div className="text-center items-center">
              <p className="text-xs">{product.pos_app_qty}</p>
            </div>
            <div className="text-center items-center">
              <p className="text-xs">{product.price}</p>
            </div>
            <div className="text-center items-center">
              <p className="text-xs">{product.price * product.pos_app_qty}</p>
            </div>
          </React.Fragment>
        ))}

      </div>
      <div id="chosenProducts"></div>
      <div className="bg-green-700 m-2 rounded-md p-1 space-y-1.5">
        <div>
          <p className="text-xs text-white">{currentDate}</p>
        </div>
        <div className="h-0.5 bg-green-600"></div>
        <div className="grid grid-cols-4 gap-4 mr-2">
          <div className="col-span-2"></div>
          <div className="text-right">
            <p className="text-xs text-white">Total</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold text-white" id="total-amount">{calculateTotal()}</p>

          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mr-2">
          <div className="col-span-2"></div>
          <div className="text-right">
            <p className="text-xs text-white">Kadiwa Pts</p>
          </div>
          <div className="text-right">
            <p id="total-amount" className="text-xs font-semibold text-white">- {kadiwaPts}</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 mr-2">
          <div className="col-span-2"></div>
          <div className="text-right">
            <p className="text-xs text-white">Discounts</p>
          </div>
          <div className="text-right">
            <p id="total-amount" className="text-xs font-semibold text-white">- {discountAmount}</p>
          </div>
        </div>
        {/* <div className="grid grid-cols-4 gap-4 mr-2">
          <div className="col-span-2"></div>
          <div className="text-right">
            <p className="text-xs text-white">Service Fee</p>
          </div>
          <div className="text-right">
            <p id="total-amount" className="text-xs font-semibold text-white">0.00</p>
          </div>
        </div> */}
        <div className="grid grid-cols-4 gap-4 mr-2">
          <div className="col-span-2"></div>
          <div className="text-right">
            <p className="text-xs text-white">Delivery Fee</p>
          </div>
          <div className="text-right">
            <p id="total-amount" className="text-xs font-semibold text-white">
              {parseFloat(deliveryFee).toFixed(2)}
            </p>
          </div>
        </div>



        
        <div className="h-0.5 bg-green-600"></div>
        <div className="grid grid-cols-4 gap-4 mr-2">
          <div className="col-span-2"></div>
          <div className="text-right">
            <p className="text-xs text-white font-bold">Grand Total</p>
          </div>
          <div className="text-right">
            <p id="total-amount" className="text-xs font-bold text-white">{grandTotal}</p>
          </div>
        </div>

      </div>
      <div className="bg-white rounded-md p-5 m-2 shadow-md justify-around flex">
        <button onClick={() => {
          if (calculateTotal() < 200) {
            setShowWarningModal(true);
          } else {
            setShowQRCodeScanner(true);
          }
        }} className="icon-button text-gray-700">
          <IoQrCode />
          <p className="text-xs font-bold">Points</p>
        </button>

        <button
          onClick={() => {
            if (calculateTotal() < 200) {
              setShowWarningModal(true);
            } else {
              setShowDiscountModal(true);
            }
          }}
          className="icon-button text-gray-700"
        >
          <MdOutlineLocalOffer />
          <p className="text-xs font-bold">Discount</p>
        </button>
        {/* <button className="icon-button text-gray-700 ">
          <MdOutlinePayment />
          <p className="text-xs font-bold">Service Fee</p>
        </button> */}
        <button
          onClick={() => setShowDeliveryModal(true)}
          className="icon-button text-gray-700"
        >
          <CiDeliveryTruck />
          <p className="text-xs font-bold">Delivery Fee</p>
        </button>

      </div>
      <div className="w-screen flex">
        <button className="w-full border border-green-600 m-2 rounded-md text-green-700 font-bold">
          CONFIRM
        </button>
      </div>
      {/* Render DiscountModal based on the state */}
      {showDiscountModal && (
        <DiscountModal
          onClose={() => setShowDiscountModal(false)}
          onApplyDiscount={handleApplyDiscount}
        />
      )}

      {/* Render QRCodeScanner based on the state */}
      {showQRCodeScanner && (
        <QRCodeScanner onSave={handleScan} onClose={() => setShowQRCodeScanner(false)} />
      )}

      {showWarningModal && (
        // Render your warning modal component here
        <WarningModal onClose={() => setShowWarningModal(false)} />
      )}

      {showDeliveryModal && (
        <DeliveryModal
          onClose={() => setShowDeliveryModal(false)}
          onSave={handleSaveDeliveryFee}
        />
      )}


    </div>
  );
};

export default ReceiptComponent;
