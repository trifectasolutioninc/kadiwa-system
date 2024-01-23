import React, { useEffect, useState } from 'react';
import { imageConfig } from '../Configuration/config-file';
import configFirebaseDB from '../Configuration/config';
import { ref, child, get } from 'firebase/database';
import redirectToIndexIfNoConnect from '../Scripts/connections/check';
import { useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import SpaOutlinedIcon from '@mui/icons-material/SpaOutlined';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import StarOutlineOutlinedIcon from '@mui/icons-material/StarOutlineOutlined';

const ProductDetails = ({ productDetails }) => {
  if (!productDetails) {
    return <div>Error: Product not found.</div>;
  }

  const { product_name, commodity_type, price, unit_measurement, keywords } = productDetails;
  const imageSrc = imageConfig[keywords];

  const handleAddToCart = () => {
    // Implement the logic to add the product to the cart
    console.log('Product added to cart:', product_name);
  };

  return (
    <div className="p-2 bg-white rounded-md shadow-md m-2">
      <h1 className="font-bold text-green-700">Product Details</h1>
      <div id="product-details-container" className="h-full flex grid grid-cols-2">
        <div className="">
          <img src={imageSrc} alt={product_name} className="rounded-md bg-cover" />
        </div>
        <div className=" p-2">
            <div className='h-1/2'>
                <h2 className="text-gray-700 font-bold">{product_name}</h2>
                <p className="text-xs text-gray-500">Commodity Type: {commodity_type}</p>
                <p className="text-sm text-green-600 font-semibold">
                    Price: ₱{price} ({unit_measurement})
                </p>
            </div>
          
            <div className="flex items-center h-1/2 justify-between mt-2">
                <div className='border w-1/2 items-center flex  justify-center'>
                    <SpaOutlinedIcon className="text-green-500 mr-1" />
                    <span className="hidden sm:hidden md:block text-xs text-green-500 mr-2">No of Leaves</span>
                </div>
                <div onClick={handleAddToCart} className='border w-1/2 items-center flex  justify-center'>
                    <StarOutlineOutlinedIcon className="text-yellow-600 mr-1" />
                    <span className="hidden sm:hidden  md:block text-xs text-blue-500 mr-2">Add to Cart</span>

                </div>
                
                
            </div>
          {/* Add more HTML elements for other product details */}
        </div>
      </div>
    </div>
  );
};


const StoreList = () => (
  <div className="mx-3">
    <p>Store List</p>
  </div>
);

const ProductInfo = () => {
  const { productCode, productName } = useParams();
  const [productDetails, setProductDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const isValidContact = redirectToIndexIfNoConnect();

    if (!isValidContact) {
      // Handle redirection or other actions
      return;
    }

    const database = configFirebaseDB();
    const productsInfoRef = ref(database, 'products_info');

    const decodedProductName = decodeURIComponent(productName);

   get(child(productsInfoRef, productCode))
  .then((snapshot) => {
    const productDetails = snapshot.val();
    if (productDetails) {
      setProductDetails(productDetails);
    } else {
      console.error('Product not found in the database.');
    }
  })
  .catch((error) => {
    console.error('Error fetching product details:', error);
  })
  .finally(() => {
    setIsLoading(false);
  });

  }, [productCode, productName]);

  return (
    <div>
      {isLoading ? (
        <p className='p-5 text-green-600'>Loading...</p>
      ) : (
        <>
          <ProductDetails productDetails={productDetails} />
          <StoreList />
        </>
      )}
    </div>
  );
};

export default ProductInfo;
