import React, { useEffect, useState } from 'react';
import { ref, child, get, set } from 'firebase/database';
import configFirebaseDB from '../Configuration/config';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import { useNavigate } from 'react-router-dom';

const StoreList = ({ productCode }) => {
  const [storesWithProduct, setStoresWithProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [noStoresFound, setNoStoresFound] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [deliveryOption, setDeliveryOption] = useState("pickup"); // Default to "pickup"
  const navigate = useNavigate();


  const kdwconnect = sessionStorage.getItem('kdwconnect');
    useEffect(() => {
      const database = configFirebaseDB();
      const usersAccountRef = ref(database, 'kadiwa_users_account');
      const productInventoryRef = ref(database, 'product_inventory');
  
      // Fetch product details
      get(productInventoryRef)
        .then((snapshot) => {
          if (!snapshot.exists()) {
            console.error('Product details not found.');
            setIsLoading(false);
            return;
          }
  
          const productDetails = snapshot.val();
  
          // Filter products based on the desired product code
          const filteredProducts = Object.values(productDetails)
            .filter((product) => String(product.product_code) === String(productCode));
  
          console.log('Filtered Products:', filteredProducts);

          setFilteredProducts(filteredProducts);
  
          if (filteredProducts.length === 0) {
            console.error(`No product found with code ${productCode}`);
            setIsLoading(false);
            setNoStoresFound(true);
            return;
          }
  
          // Extract store IDs from the filtered products
          const storeIds = filteredProducts.map((product) => product.id.split('-')[0]);
  
          console.log('Store IDs:', storeIds);
  
          // Fetch store details for the identified stores
          const storePromises = storeIds.map((storeKey) => get(child(usersAccountRef, storeKey)));
          return Promise.all(storePromises);
        })
        .then((storeSnapshots) => {
            if (!storeSnapshots || storeSnapshots.some((snapshot) => !snapshot.exists())) {
              console.error('Error fetching store details: Some store details are missing or undefined.');
              setNoStoresFound(true);
              return;
            }
          
            const stores = storeSnapshots.map((snapshot) => snapshot.val());
            console.log('Stores with Product:', stores);
            setStoresWithProduct(stores);
          })
          .catch((error) => {
            console.error('Error fetching store details:', error);
            setNoStoresFound(true);
          })
          .finally(() => {
            setIsLoading(false);
          });
    }, [productCode]);
  
   // Function to open the modal
   const openModal = (store) => {
    setSelectedStore(store);
    setIsModalOpen(true);
};

// Function to close the modal
const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStore(null);
    setSelectedQuantity(1);
};

const addToCart = () => {
  // Check if there is a selected store and product
  if (!selectedStore || filteredProducts.length === 0) {
    console.error('Cannot add to cart: Selected store or product not available.');
    return;
  }

  

  // Get the product details
  const product = filteredProducts[0];

  // Create the cart item object
  const cartItem = {
    commodity_type: product.commodity_type,
    keywords: product.keywords,
    price: product.price,
    product_code: product.product_code,
    product_name: product.product_name,
    unit_measurement: product.unit_measurement,
    qty: selectedQuantity,
  };

  // Construct the key for the cart collection
  const cartKey = `${kdwconnect}-${selectedStore.storeName}`;

  // Construct the cart collection path
  const cartCollectionPath = `cart_collection/${cartKey}`;

  // Get a reference to the cart collection in the database
  const cartCollectionRef = ref(configFirebaseDB(), cartCollectionPath);

  // Update the cart collection with the new item
  get(cartCollectionRef)
    .then((snapshot) => {
      const cartData = snapshot.exists() ? snapshot.val() : {};
      cartData.storeName = selectedStore.storeName;
      cartData.ownerNo = selectedStore.contact;
      cartData.CartList = cartData.CartList || {};
      cartData.CartList[product.product_code] = cartItem;

      // Save the updated cart data back to the database
      return set(cartCollectionRef, cartData);
    })
    .then(() => {
      console.log('Item added to cart successfully.');
    })
    .catch((error) => {
      console.error('Error adding item to cart:', error);
    })
    .finally(() => {
      closeModal();
    });
};

// Function to open the checkout modal
const openCheckoutModal = (store) => {
  setSelectedStore(store);
  setIsCheckoutModalOpen(true);
};

// Function to close the checkout modal
const closeCheckoutModal = () => {
  setIsCheckoutModalOpen(false);
  setSelectedStore(null);
};

const incrementQuantity = () => {
  setSelectedQuantity(prevQuantity => prevQuantity + 1);
};

// Function to decrement quantity, with a minimum value of 1
const decrementQuantity = () => {
  setSelectedQuantity(prevQuantity => Math.max(prevQuantity - 1, 1));
};


const handleCheckout = () => {

  // Check if there is a selected store and product
  if (!selectedStore || filteredProducts.length === 0) {
    console.error('Cannot checkout: Selected store or product not available.');
    return;
  }

  // Get the product details
  const product = filteredProducts[0];

  // Create the order object
  const order = {
    storeName: selectedStore.storeName,
    city: selectedStore.city,
    province: selectedStore.province,
    product: {
      commodity_type: product.commodity_type,
      keywords: product.keywords,
      price: product.price,
      product_code: product.product_code,
      product_name: product.product_name,
      unit_measurement: product.unit_measurement,
    },
    quantity: selectedQuantity,
    deliveryOption: deliveryOption,
  };

  console.log('Order:', order);

  // Navigate to the respective page based on the delivery option
  if (deliveryOption === 'pickup') {
    // Pass the order information to the Pickup page
    console.log('Navigating to Pickup page with order:', order);
    navigate('/route/pickup', { state: { order } });
  } else if (deliveryOption === 'delivery') {
    // Pass the order information to the Delivery page
    console.log('Navigating to Delivery page with order:', order);
    navigate('/route/delivery', { state: { order } });
  }

  // Close the checkout modal
  closeCheckoutModal();
};

    return (
        <div>
        <h2 className="p-4 font-bold text-green-700">Stores</h2>
        {isLoading ? (
          <p className="p-5 text-green-600">Loading...</p>
        ) : noStoresFound ? (
          <p className="p-5 text-red-600">No stores with this product.</p>
        ) : (
          <ul>
            {storesWithProduct.map((store) => (
              <div key={store.contact} className='bg-white mx-4 my-1 p-4 rounded-md shadow-md justify-between flex'>
                <div>
                  <p className='text-lg font-bold text-gray-800'>{store.storeName}</p>
                  <p className='text-gray-700'>{store.city}, {store.province}</p>
                </div>
                <div className='gap-2 items-center justify-center flex flex-col md:flex-row'>
                  <button onClick={() => openCheckoutModal(store)} className='bg-green-700 rounded px-2 py-1 text-white text-sm w-full'>Check-out</button>
                  <button onClick={() => openModal(store)} className='bg-gray-300 rounded px-2 py-1 text-gray-800 text-sm w-full whitespace-nowrap'>Add to Cart</button>
                  {/* <button className=' rounded px-2 py-1'><AddShoppingCartOutlinedIcon className='text-green-700' /></button> */}
                </div>
              </div>
            ))}
          </ul>

        )}
      {/* Modal for adding to cart */}
      {isModalOpen && (
        <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-sm'>
            <div className='absolute bg-white p-6 rounded-md shadow-md w-3/4'>
                <h3 className='text-lg font-bold text-gray-800'>{selectedStore.storeName}</h3>
                <p className='text-gray-700'>{selectedStore.city}, {selectedStore.province}</p>

                  {/* Display product details */}
                  {filteredProducts.length > 0 && (
                    <div>
                        <p className='mt-4'>Product: {filteredProducts[0].product_name}</p>
                        <p>Price: {filteredProducts[0].price}</p>
                    </div>
                )}
                {/* Quantity input with add/subtract buttons */}
                <div className='flex items-center mt-2'>
                    <button onClick={decrementQuantity} className='bg-gray-700 text-white px-2 py-1 rounded-l-md'>-</button>
                    <input type='number' value={selectedQuantity} onChange={(e) => setSelectedQuantity(e.target.value)} className='border border-gray-300 px-2 py-1 w-16 text-center w-full' />
                    <button onClick={incrementQuantity} className='bg-gray-700 text-white px-2 py-1 rounded-r-md'>+</button>
                </div>
                  <div className='flex items-center justify-between mt-4'>
                    <button onClick={closeModal} className='bg-gray-300 text-gray-800 px-4 py-2  rounded-md' >Cancel</button>
                    <button onClick={addToCart} className='bg-green-700 text-white px-4 py-2  rounded-md'>Add to Cart</button>

                  </div>
                
                
            </div>
        </div>
    )}

   {/* Modal for checkout */}
   {isCheckoutModalOpen && (
        <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-sm'>
          <div className='absolute bg-white p-6 rounded-md shadow-md w-3/4'>
            <h3 className='text-lg font-bold text-gray-800'>{selectedStore.storeName}</h3>
            <p className='text-gray-700'>{selectedStore.city}, {selectedStore.province}</p>

            {/* Display product details (if needed) */}
            {filteredProducts.length > 0 && (
              <div>
                <p className='mt-4'>Product: {filteredProducts[0].product_name}</p>
                <p>Price: {filteredProducts[0].price}</p>
              </div>
            )}

            {/* Quantity input with add/subtract buttons */}
            <div className='flex items-center mt-2'>
              <button  onClick={decrementQuantity} className='bg-gray-700 text-white px-2 py-1 rounded-l-md'>-</button>
              <input type='number' value={selectedQuantity} onChange={(e) => setSelectedQuantity(e.target.value)} className='border border-gray-300 px-2 py-1 w-16 text-center w-full' />
              <button  onClick={incrementQuantity} className='bg-gray-700 text-white px-2 py-1 rounded-r-md'>+</button>
            </div>
            <div>
              <label className="mr-2">
                <input
                  type="radio"
                  value="pickup"
                  checked={deliveryOption === "pickup"}
                  onChange={() => setDeliveryOption("pickup")}
                />
                Pickup
              </label>
              <label>
                <input
                  type="radio"
                  value="delivery"
                  checked={deliveryOption === "delivery"}
                  onChange={() => setDeliveryOption("delivery")}
                />
                Delivery
              </label>
            </div>

            <div className='flex items-center justify-between mt-4'>
              <button onClick={closeCheckoutModal} className='bg-gray-300 text-gray-800 px-4 py-2 rounded-md'>Cancel</button>
              <button className='bg-yellow-600 text-white px-4 py-2 rounded-md' onClick={handleCheckout}>Checkout</button>
            </div>
          </div>
        </div>
      )}
      </div>
    );
  };
  
  export default StoreList;