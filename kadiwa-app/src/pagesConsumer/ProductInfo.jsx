import React, { useEffect, useState } from 'react';
import { imageConfig } from '../Configuration/config-file';
import configFirebaseDB from '../Configuration/config';
import { ref, child, get } from 'firebase/database';
import redirectToIndexIfNoConnect from '../Scripts/connections/check';
import { useParams } from 'react-router-dom';

const ProductDetails = ({ productDetails }) => {
  if (!productDetails) {
    return <div>Error: Product not found.</div>;
  }

  const { product_name, commodity_type, price, unit_measurement, keywords } = productDetails;
  const imageSrc = imageConfig[keywords];

  return (
    <div className="p-2 bg-white rounded-md shadow-md m-2">
      <h1 className="font-bold text-green-700">Product Details</h1>
      <div id="product-details-container" className="h-full flex grid grid-cols-2">
        <div className="h-1/2">
          <img src={imageSrc} alt={product_name} className="rounded-md bg-cover" />
        </div>
        <div className="h-1/2 p-2">
          <h2 className="text-gray-700 font-bold">{product_name}</h2>
          <p className="text-xs text-gray-500">Commodity Type: {commodity_type}</p>
          <p className="text-sm text-green-600 font-semibold">
            Price: ₱{price} ({unit_measurement})
          </p>
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
        <p>Loading...</p>
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
