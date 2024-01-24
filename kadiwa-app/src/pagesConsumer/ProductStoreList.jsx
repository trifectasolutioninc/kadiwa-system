import React, { useEffect, useState } from 'react';
import { ref, child, get } from 'firebase/database';
import configFirebaseDB from '../Configuration/config';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';

const StoreList = ({ productCode }) => {
    const [storesWithProduct, setStoresWithProduct] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [noStoresFound, setNoStoresFound] = useState(false);
  
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
                <div className='space-x-5 items-center justify-center flex'>
                  <button className='bg-green-700 rounded px-2 py-1 text-white'>Check-out</button>
                  <button className=' rounded px-2 py-1'><AddShoppingCartOutlinedIcon className='text-green-700' /></button>
                </div>
              </div>
            ))}
          </ul>
        )}
      </div>
    );
  };
  
  export default StoreList;