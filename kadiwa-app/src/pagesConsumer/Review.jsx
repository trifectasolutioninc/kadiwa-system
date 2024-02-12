import React, { useState, useEffect } from 'react';
import configFirebaseDB from '../Configuration/config-firebase2';
import { ref, child, get } from 'firebase/database';
import { Avatar, Badge } from '@mui/material';


const Reviews = ({ productCode }) => {
  const [reviews, setReviews] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const kdwowner = productCode.split('-')[0]+'-'+productCode.split('-')[1];
  const productno = productCode.split('-')[2];
  useEffect(() => {
    const fetchData = async () => {
      // Fetch product reviews
      const reviewsRef = ref(configFirebaseDB, 'product_reviews');
      const reviewsSnapshot = await get(reviewsRef);
      const reviewsData = reviewsSnapshot.val();
      setReviews(reviewsData);

      // Fetch user info based on contact
      const usersRef = ref(configFirebaseDB, 'store_information');
      const usersSnapshot = await get(child(usersRef, kdwowner));
      const userData = usersSnapshot.val();
      setUserInfo(userData);

      setLoading(false);
    };

    fetchData();
  }, []); // Run once on component mount

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='px-4 '>
        <h1 className=' text-gray-900 text-sm font-bold mb-4'>Reviews</h1>
      {Object.keys(reviews).map((reviewId) => {
        const review = reviews[reviewId];
        const productNumber = parseInt(productno);
        console.log(review.productCode);
        console.log(productNumber);
        console.log(userInfo.id);
        console.log(review.storeOwnerID);
        if ((review.storeOwnerID === userInfo.id) && ( productNumber === review.productCode)) {
          
          return (
            <div key={reviewId} >
                <div className='grid grid-cols-10 bg-gray-200 py-2 px-1 items-center rounded-t-md'>
                    <div className=' col-span-2'>
                        <Avatar/>
                    </div>
                    <div className=' col-span-8'>
                        <p className='font-black text-gray-800 text-sm'>{review.consumerName}</p>
                        
                        <p className='text-xs'>{review.suggestions}</p>
                        <p className='text-xs font-bold text-gray-500'>Rating: {review.rating}</p>

                    </div>
              

                </div>
                <div className=' h-0.5 bg-gray-300 rounded-b-md'> </div>
              
            </div>
            
          );
        }

 
        return null;
      })}
    </div>
  );
};

export default Reviews;

