import React, { useState, useEffect } from "react";
import configFirebaseDB from "../Configuration/config-firebase2";
import { ref, child, get } from "firebase/database";

const Reviews = ({ productCode }) => {
  const [reviews, setReviews] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const uid = productCode.split("-")[0] + "-" + productCode.split("-")[1];
  const productno = productCode.split("-")[2];
  useEffect(() => {
    const fetchData = async () => {
      // Fetch product reviews
      const reviewsRef = ref(configFirebaseDB, "product_reviews");
      const reviewsSnapshot = await get(reviewsRef);
      const reviewsData = reviewsSnapshot.val();
      setReviews(reviewsData);
      console.log(uid);

      // Fetch user info based on contact
      const usersRef = ref(configFirebaseDB, "store_information");
      const usersSnapshot = await get(child(usersRef, uid));
      const userData = usersSnapshot.val();
      setUserInfo(userData);

      setLoading(false);
    };

    fetchData();
  }, []); 

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-3 md:px-10 space-y-5 mb-28">
      <h1 className=" text-gray-900 font-bold mb-4">Reviews</h1>
      {Object.keys(reviews).map((reviewId) => {
        const review = reviews[reviewId];
        const productNumber = parseInt(productno);
        console.log(review.productCode);
        console.log(productNumber);
        console.log(userInfo.id);
        console.log(review.storeOwnerID);
        if (
          review.storeOwnerID === userInfo.id &&
          productNumber === review.productCode
        ) {
          return (
            <div key={reviewId}>
              <div className="flex items-center bg-white p-3 gap-5 rounded-t-md shadow-md border">
                <div className="space-y-3">
                  <p className="font-black text-xl text-gray-800 ">
                    {review.consumerName}
                  </p>
                  <p className="font-bold text-gray-500">
                    Rating: {review.rating}
                  </p>
                  <p className="s">{review.suggestions}</p>
                </div>
              </div>
              <div className=" h-0.5 bg-gray-300 rounded-b-md"> </div>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
};

export default Reviews;
