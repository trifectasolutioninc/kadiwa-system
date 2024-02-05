import React, { useState, useEffect } from 'react';
import { ref, onValue, update } from 'firebase/database';
import firebaseDB from '../Configuration/config-firebase2';
import { imageConfig, commodityTypes } from '../Configuration/config-file';
import { BsSave2 } from "react-icons/bs";
import { MdDeleteOutline } from "react-icons/md";
import { Link } from 'react-router-dom';


const Products = () => {

    const [selectedCommodity, setSelectedCommodity] = useState("All Commodities");
    const [totalAmount, setTotalAmount] = useState(0);  // Initialize with 0
    const [totalQuantity, setTotalQuantity] = useState(0); 
    const [products, setProducts] = useState([]);
    const kdwconnect = sessionStorage.getItem('kdwconnect');

    useEffect(() => {
  
        displayProducts('All Commodities');
    }, [kdwconnect]);
    
    const handleCommodityClick = (commodityType) => {
        setSelectedCommodity(commodityType);
        displayProducts(commodityType);
    };


    
    


    

    
    const displayProducts = (commodityType) => {
        const productsRef = ref(firebaseDB, 'product_inventory');

        onValue(productsRef, (snapshot) => {
            const products = snapshot.val();

            if (products) {
                try {
                    const filteredProducts = Object.values(products || {})
                        .filter(product =>
                            product &&
                            (product.commodity_type === commodityType || commodityType === 'All Commodities') &&
                            product.id &&
                            product.id.includes(kdwconnect)
                        );

                    setProducts(filteredProducts);
                    
                } catch (error) {
                    console.error('Error in filterProducts:', error);
                }
            }
        }, (error) => {
            console.error('Error fetching and filtering products:', error);
        });
    };
    

  

  
    
    return (
        <div>
                  <div className=" p-4">
        <span className="text-green-700 font-bold text-lg">Products</span>
      </div>

     
            <div className="overflow-x-auto w-screen flex px-2">
                {commodityTypes.map((commodityType, index) => (
                    <button
                        key={index}
                        className={`border-green-700 border ${selectedCommodity === commodityType ? 'bg-green-700 text-white' : 'text-green-700'} text-xs rounded py-2 px-4 m-2 w-auto whitespace-nowrap tab-button`}
                        onClick={() => handleCommodityClick(commodityType)}
                    >
                        {commodityType}
                    </button>
                ))}
            </div>
            <div id="productlist" className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 mb-24">
            {products.map((product) => (
                <div key={product.product_code} className="container h-auto mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                        {/* Your product JSX */}
                        <img
                            id={`product${product.product_code}`}
                            alt={product.product_name}
                            className="h-1/2 w-full object-cover"
                            src={imageConfig[product.keywords.toLowerCase()]}
                        />
                        <div className=" mt-2 p-2 h-1/2 flex items-end">
                            <div className='text-left mb-2'>
                            <h2 className="text-xs font-bold text-gray-700">{product.product_name}</h2>
                            <p className="text-xs font-semibold text-gray-500">{product.commodity_type}</p>
                            <p className="text-xs font-bold text-green-600 mb-1">Php {product.price.toFixed(2)}</p>
                            <p className="text-xs bg-green-500 rounded-xl text-white p-1">{`Stock: ${product.stock} (${product.unit_measurement})`}</p>


                            </div>
                           
                            
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Products;
