import React, { useEffect, useState } from "react";
import { imageConfig } from "../Configuration/config-file";
import configFirebaseDB from "../Configuration/config";
import { ref, child, get } from "firebase/database";
import redirectToIndexIfNoConnect from "../Scripts/connections/check";
import { NavLink, useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import { TiArrowForward } from "react-icons/ti";
import Reviews from "./Review";
import StoreInfo from "./StoreofProduct";

import StarOutlineOutlinedIcon from "@mui/icons-material/StarOutlineOutlined";
import { IoMdArrowRoundBack } from "react-icons/io";

const ProductDetails = ({ productDetails }) => {
  if (!productDetails) {
    return <div>Error: Product not found.</div>;
  }

  const { product_name, commodity_type, price, unit_measurement, keywords } =
    productDetails;

  const imageSrc = imageConfig[keywords];

  const handleAddToCart = () => {
    // Implement the logic to add the product to the cart
    console.log("Product added to cart:", product_name);
  };

  return (
    <>
      <div className="p-3 md:p-10 space-y-5">
        <div className="fixed flex items-center gap-5 bg-gray-100 w-full top-0 p-3 md:p-5">
          <NavLink to={`/main/storepage/`} className="">
            <IoMdArrowRoundBack fontSize={"25px"} />
          </NavLink>
          <h1 className="text-xl font-bold  text-green-700">Product Details</h1>
        </div>
        <main className="mb-28">
          <div className="p-3 bg-white rounded-md shadow-md mt-12">
            <div
              id="product-details-container"
              className="h-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2"
            >
              <div className="h-auto space-y-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2">
                <img
                  src={imageSrc}
                  alt={product_name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className=" p-4">
                <div className="flex justify-between">
                  <h2 className="text-gray-700 font-bold">{product_name}</h2>
                  <div className="flex space-x-2">
                    <StarIcon fontSize={"20px"} className="text-yellow-500" />
                    <TiArrowForward className="text-green-700" />
                  </div>
                </div>
                <div>
                  <p className=" text-green-600 font-semibold">
                    Price: ₱{price} ({unit_measurement})
                  </p>
                  <p className=" text-gray-500">
                    Commodity Type: {commodity_type}
                  </p>
                </div>
                <div className="flex justify-between mt-4">
                  <div className="flex jus space-x-2">
                    <div className="flex items-center text-yellow-500">
                      <StarIcon fontSize={"20px"} />
                      <StarIcon fontSize={"20px"} />
                      <StarIcon fontSize={"20px"} />
                      <StarHalfIcon fontSize="120px" />
                      <StarBorderIcon fontSize={"20px"} />
                    </div>
                    <p className=" text-gray-500">3.5/5.0</p>
                  </div>
                  <div className="flex justify-center">
                    <p className="text-gray-500 ">1,032 sold</p>
                  </div>
                </div>
                <div></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

<div className="mx-3">
  <p>Store List</p>
</div>;

const StoreProductDetails = ({ product_inventory, kadiwa_users_account }) => {
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
    const productsInfoRef = ref(database, "product_inventory");

    const decodedProductName = decodeURIComponent(productName);

    get(child(productsInfoRef, productCode))
      .then((snapshot) => {
        const productDetails = snapshot.val();
        if (productDetails) {
          setProductDetails(productDetails);
        } else {
          console.error("Product not found in the database.");
        }
      })
      .catch((error) => {
        console.error("Error fetching product details:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [productCode, productName]);

  return (
    <div className="">
      {isLoading ? (
        <p className="p-5 text-green-600">Loading...</p>
      ) : (
        <>
          <ProductDetails productDetails={productDetails} />
          <StoreInfo productCode={productCode} />
          <Reviews productCode={productCode} />
        </>
      )}
    </div>
  );
};

export default StoreProductDetails;
