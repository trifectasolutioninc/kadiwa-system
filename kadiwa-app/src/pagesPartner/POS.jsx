import React, { useState, useEffect } from 'react';
import { ref, onValue, update } from 'firebase/database';
import firebaseDB from '../Configuration/config-firebase2';
import { imageConfig, commodityTypes } from '../Configuration/config-file';
import { BsSave2 } from "react-icons/bs";
import { MdDeleteOutline } from "react-icons/md";
import { Link } from 'react-router-dom';


const POS = () => {

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

    const handleQuantityChange = (productCode, action) => {
        setProducts(prevProducts => {
            const updatedProducts = prevProducts.map(product => {
                if (product.product_code === productCode) {
                    const currentQty = product.pos_app_qty;
                    const stock = product.stock || 0; // Ensure stock is a number
    
                    // Check if stock is greater than 0 and pos_app_qty is less than stock for addition
                    if (action === 'add' && stock > 0 && currentQty < stock) {
                        const newQty = currentQty + 1;
                        const newTotalAmount = product.price * newQty;
                        handleSaveQuantity(productCode, newQty, newTotalAmount);
                        return { ...product, pos_app_qty: newQty };
                    } else if (action === 'subtract' && currentQty > 0) {
                        // For subtraction, ensure pos_app_qty is greater than 0
                        const newQty = Math.max(currentQty - 1, 0);
                        const newTotalAmount = product.price * newQty;
                        handleSaveQuantity(productCode, newQty, newTotalAmount);
                        return { ...product, pos_app_qty: newQty };
                    }
                }
                return product;
            });
    
            updatePosAppTotalAmount(updatedProducts);
            return updatedProducts;
        });
    };
    
    
    const handleSaveQuantity = (productCode, newQty, newTotalAmount) => {
        // Save the quantity and total amount to the database (Firebase) here
        const productRef = ref(firebaseDB, `product_inventory/${kdwconnect}-${productCode}`);
        update(productRef, { pos_app_qty: newQty, pos_app_total_amount: newTotalAmount })
            .then(() => {
                console.log('Quantity and total amount saved to Firebase successfully.');
            })
            .catch(error => {
                console.error('Error saving quantity and total amount to Firebase:', error);
            });
    };
    
    const updatePosAppTotalAmount = (updatedProducts) => {
        const totalQty = updatedProducts.reduce((total, product) => {
            const qty = product.pos_app_qty || 0; // Ensure pos_app_qty is a number
            return total + qty;
        }, 0);
        setTotalQuantity(totalQty);
    
        const totalAmount = updatedProducts.reduce((total, product) => {
            const qty = product.pos_app_qty || 0; // Ensure pos_app_qty is a number
            const price = product.price || 0; // Ensure price is a number
            return total + (price * qty);
        }, 0);
        setTotalAmount(totalAmount);
    
        console.log('Updated Total Quantity:', totalQty);
        console.log('Updated Total Amount:', totalAmount);
    };
    
    
    

    const handleClearQuantity = (productCode) => {
        // Implement the logic to clear the quantity
        // For example, update the state or perform any necessary actions
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
                    updatePosAppTotalAmount(filteredProducts);
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
                  <div className="text-center py-4">
        <span className="text-green-700 font-bold text-lg">POS</span>
      </div>
      <div className="h-0.5 bg-green-500"></div>
      <div className="bg-green-500 justify-around m-2 rounded-2xl p-1 flex">
                <Link to={'/partner/review'} id="reviewButton" className="bg-white p-1 rounded-xl text-center justify-center flex text-green-600 text-sm"><span>REVIEW</span></Link>
                <div className="text-center">
                    <p className="text-xs text-white">Total Amount</p>
                    <p id="total-amount" className="text-sm font-semibold text-white">{`Php ${totalAmount.toFixed(2)}`}</p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-white">Product QTY.</p>
                    <p id="product-qty" className="text-sm font-semibold text-white">{totalQuantity}</p>
                </div>
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
                <div key={product.product_code} className="container mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                        {/* Your product JSX */}
                        <img
                            id={`product${product.product_code}`}
                            alt={product.product_name}
                            className="h-1/2 w-full object-cover"
                            src={imageConfig[product.keywords.toLowerCase()]}
                        />
                        <div className="text-left mt-2 p-2 h-1/2">
                            <h2 className="text-xs font-bold text-gray-700">{product.product_name}</h2>
                            <p className="text-xs font-semibold text-gray-500">{product.commodity_type}</p>
                            <p className="text-xs font-bold text-green-600 mb-1">Php {product.price.toFixed(2)}</p>
                            <p className="text-xs bg-green-500 rounded-xl text-white p-1">{`Stock: ${product.stock} (${product.unit_measurement})`}</p>

                            {/* Quantity elements */}
                            <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center mt-2">
                                    <button
                                        className="text-xs px-2 py-1 bg-red-500 text-white rounded-l"
                                        onClick={() => handleQuantityChange(product.product_code, 'subtract')}
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        className="text-xs px-0 py-1 border border-gray-300 rounded-none w-10 text-center flex"
                                        value={product.pos_app_qty}
                                        readOnly
                                    />
                                    <button
                                        className="text-xs px-2 py-1 bg-blue-500 text-white rounded-r"
                                        onClick={() => handleQuantityChange(product.product_code, 'add')}
                                    >
                                        +
                                    </button>
                                </div>
                                <div className="flex items-center mt-2">
                                    <button
                                        className="text-xs px-2 py-1 bg-green-500 text-white rounded"
                                        onClick={() => handleSaveQuantity(product.product_code)}
                                    >
                                        <BsSave2 />
                                    </button>
                                    <button
                                        className="text-xs px-2 py-1 bg-gray-500 text-white rounded"
                                        onClick={() => handleClearQuantity(product.product_code)}
                                    >
                                       <MdDeleteOutline />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default POS;
