import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ref, get , update} from 'firebase/database';
import configFirebaseDB from '../Configuration/config';
import ChatIcon from '@mui/icons-material/Chat';
import { imageConfig, commodityTypes } from '../Configuration/config-file';
import { Link } from 'react-router-dom'; 

const StoreInfo = () => {

  const { productCode } = useParams();
  const [storeData, setStoreData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const kdwconnect = sessionStorage.getItem('kdwconnect');
  const kdwowner = productCode.split('-')[0];
  const productno = productCode.split('-')[1];

  useEffect(() => {
    const fetchStoreData = async () => {
      const database = configFirebaseDB();
      const storeRef = ref(database, `kadiwa_users_account/${kdwowner}`);

      try {
        const storeSnapshot = await get(storeRef);

        if (storeSnapshot.exists()) {
          const storeInfo = storeSnapshot.val();
          setStoreData(storeInfo);
        } else {
          console.error(`Store with ID ${kdwowner} not found`);
        }
      } catch (error) {
        console.error('Error fetching store data:', error);
      }
    };

    fetchStoreData();

  }, [productCode]);

  const fetchProductDetails = async () => {
    const database = configFirebaseDB();
    const productRef = ref(database, `product_inventory/${kdwowner}-${productno}`);

    try {
      const productSnapshot = await get(productRef);

      if (productSnapshot.exists()) {
        const productDetails = productSnapshot.val();
        setSelectedProduct(productDetails);
      } else {
        console.error(`Product with ID ${kdwowner}-${productno} not found`);
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  fetchProductDetails();

  const openModal = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const addToCart = async () => {
    const database = configFirebaseDB();
    const cartRef = ref(database, `cart_collection/${kdwconnect}-${storeData.storeName}`);
  
    try {
      // Get the current cart data
      const cartSnapshot = await get(cartRef);
      const currentCartData = cartSnapshot.val() || {};
  
      // Update or add the new item to the CartList
      const productCode = selectedProduct.product_code;
      const updatedCartData = {
        ...currentCartData,
        storeName: storeData.storeName,
        ownerNo: storeData.contact,
        CartList: {
          ...currentCartData.CartList,
          [productCode]: {
            commodity_type: selectedProduct.commodity_type,
            keywords: selectedProduct.keywords,
            price: selectedProduct.price,
            product_code: selectedProduct.product_code,
            product_name: selectedProduct.product_name,
            unit_measurement: selectedProduct.unit_measurement,
            qty: qty,
          },
        },
      };
  
      // Save the updated cart data using the update function
      await update(cartRef, updatedCartData);
  
      console.log(`Added ${qty} ${selectedProduct.product_name} to cart`);
      setModalOpen(false);
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };


  if (!storeData) {
    return <div>Loading...</div>;
  }

  const incrementQty = () => {
    setQty((prevQty) => prevQty + 1);
  };

  const decrementQty = () => {
    setQty((prevQty) => Math.max(1, prevQty - 1));
  };


  return (
    <div className="">
    <div className=' justify-between flex p-4 rounded-md   m-4'>
      <div>
        <h1 className='text-gray-700 font-bold text-lg'>{storeData.storeName}</h1>
        <p className='text-gray-500 text-sm'>{storeData.city + ', ' + storeData.province}</p>
      </div>
      <Link to={`/main/storepage/${kdwowner}`} className="">
        <button className='bg-green-700 text-white rounded-xl px-2'>Visit</button>
      </Link>
    </div>
      <div className="flex justify-around fixed bottom-0 w-full" >
      <button onClick={() => openModal(selectedProduct)} className='bg-gray-300  h-16  text-gray-800 text-xs w-full font-bold whitespace-nowrap rounded-tr-md md:rounded-none '>Add to Cart</button>
      <button className='bg-green-700  text-white text-xs font-bold w-full rounded-br-md md:rounded-none'>Buy Now</button>
    </div>

    {/* Modal */}
    {modalOpen && selectedProduct && storeData && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="absolute bg-white p-6 rounded-md shadow-md w-3/4">
            <h3 className='text-lg font-bold text-gray-800'>{storeData.storeName}</h3>
            <p className='text-gray-700  '>{storeData.city}, {storeData.province}</p>
            <p className="mt-4">{selectedProduct.product_name}</p>
            <p className=''>Price: ${selectedProduct.price}</p>
            <div className='flex items-center mt-2'>
                    <button  onClick={decrementQty} className='bg-gray-700 text-white px-2 py-1 rounded-l-md'>-</button>
                    <input type='number' onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 0))} value={qty} className='border border-gray-300 px-2 py-1  text-center w-full' />
                    <button  onClick={incrementQty} className='bg-gray-700 text-white px-2 py-1 rounded-r-md'>+</button>
                </div>
                  <div className='flex items-center justify-between mt-4'>
                    <button onClick={() => setModalOpen(false)} className='bg-gray-300 text-gray-800 px-4 py-2  rounded-md' >Cancel</button>
                    <button onClick={() => addToCart()} className='bg-green-700 text-white px-4 py-2  rounded-md'>Add to Cart</button>

                  </div>
          </div>
        </div>
      )}
  </div>
  );
};

export default StoreInfo;
