import React, { useEffect, useState } from 'react';
import { ref, child, get } from 'firebase/database';
import configFirebaseDB from '../Configuration/config';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';

const StoreList = ({ productCode }) => {
  const [storesWithProduct, setStoresWithProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [noStoresFound, setNoStoresFound] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  
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

// Function to handle adding to cart
const addToCart = () => {
    // Implement your logic to add the selected product to the cart
    // You can use selectedStore and selectedQuantity here
    // ...
    closeModal();
};


const incrementQuantity = () => {
  setSelectedQuantity(prevQuantity => prevQuantity + 1);
};

// Function to decrement quantity, with a minimum value of 1
const decrementQuantity = () => {
  setSelectedQuantity(prevQuantity => Math.max(prevQuantity - 1, 1));
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
                  <button className='bg-green-700 rounded px-2 py-1 text-white text-sm w-full'>Check-out</button>
                  <button onClick={() => openModal(store)} className='bg-gray-300 rounded px-2 py-1 text-gray-800 text-sm w-full whitespace-nowrap'>Add to Cart</button>
                  {/* <button className=' rounded px-2 py-1'><AddShoppingCartOutlinedIcon className='text-green-700' /></button> */}
                </div>
              </div>
            ))}
          </ul>

        )}
     {/* Modal for adding to cart */}
     {isModalOpen && (
                <div className='fixed top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-lg'>
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
      </div>
    );
  };
  
  export default StoreList;