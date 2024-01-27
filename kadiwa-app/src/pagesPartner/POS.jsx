import React, { useState, useEffect } from 'react';
import { ref, onValue, set, get , update} from 'firebase/database';
import firebaseDB from '../Configuration/config-firebase2';
import { imageConfig, commodityTypes } from '../Configuration/config-file';

const POS = () => {
    const [selectedCommodity, setSelectedCommodity] = useState("All Commodities");
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [products, setProducts] = useState([]);
    const kdwconnect = sessionStorage.getItem('kdwconnect');
    console.log(kdwconnect);

    const handleCommodityClick = (commodityType) => {
        setSelectedCommodity(commodityType);
        displayProducts(commodityType);
    };
    const updateProductQuantityInFirebase = (productKey, newQuantity, newTotalAmount) => {
        const productRef = ref(firebaseDB, `product_inventory/${productKey}`);
        update(productRef, {
            pos_app_total_amount: newTotalAmount,
            pos_app_qty: newQuantity,
        })
            .then(() => {
                console.log(`Product quantity and total amount updated in Firebase: ${productKey}`);
            })
            .catch(error => {
                console.error('Error updating product quantity and total amount in Firebase:', error);
            });
    };

    const updateTotalAmountAndQuantity = () => {
        const databaseRef = ref(firebaseDB, 'product_inventory');

        onValue(databaseRef, (snapshot) => {
            const product_inventory = snapshot.val();

            const filteredProducts = Object.values(product_inventory || {})
                .filter(product => product.id.includes(kdwconnect));

            let newTotalAmount = 0;
            let newTotalQuantity = 0;

            for (const product of filteredProducts) {
                newTotalAmount += product.pos_app_total_amount || 0;
                newTotalQuantity += product.pos_app_qty || 0;
            }

            setTotalAmount(newTotalAmount);
            setTotalQuantity(newTotalQuantity);
        }, (error) => {
            console.error("Error setting up real-time listener:", error);
        });
    };

const displayProducts = (commodityType) => {
    const productsRef = ref(firebaseDB, 'product_inventory');

    get(productsRef)
        .then(snapshot => {
            const products = snapshot.val();

            const filteredProducts = Object.values(products || {})
                .filter(product => product.commodity_type === commodityType || commodityType === 'All Commodities');

            setProducts(filteredProducts);
        })
        .catch(error => {
            console.error('Error fetching and filtering products:', error);
        });
};

useEffect(() => {
    const kdwconnect = sessionStorage.getItem('kdwconnect');
    resetValuesToZero();
    displayProducts('All Commodities');
}, []);

    const updateProductQuantities = (productInventory, newValues) => {
        for (const productId in productInventory) {
            const product = productInventory[productId];

            if (product.id.includes(kdwconnect)) {
                updateProductQuantityInFirebase(productId, newValues.qty, newValues.totalAmount);
            }
        }

        updateTotalAmountAndQuantity();
    };

    const resetValuesToZero = () => {
        const databaseRef = ref(firebaseDB, 'product_inventory');
    
        onValue(databaseRef, (snapshot) => {
            try {
                const product_inventory = snapshot.val();
                updateProductQuantities(product_inventory, { qty: 0, totalAmount: 0 });
            } catch (error) {
                console.error("Error handling data from Firebase:", error);
            }
        }, (error) => {
            console.error("Error setting up real-time listener:", error);
        });
    };
    

    const handleQuantityChange = (productId, action) => {
        setProducts(prevProducts => {
            return prevProducts.map(product => {
                if (product.productId === productId) {
                    let newQty = product.pos_app_qty;
    
                    if (action === 'add') {
                        // Increment quantity
                        newQty += 1;
                    } else if (action === 'subtract' && newQty > 0) {
                        // Decrement quantity (if greater than 0)
                        newQty -= 1;
                    }
    
                    return {
                        ...product,
                        pos_app_qty: newQty,
                    };
                }
                return product;
            });
        });
    };
    
    const handleSaveQuantity = (productId) => {
        const product = products.find(p => p.productId === productId);
    
        if (product) {
            const newQty = product.pos_app_qty;
            const newTotalAmount = newQty * product.price;
    
            updateProductQuantityInFirebase(productId, newQty, newTotalAmount);
            updateTotalAmountAndQuantity(kdwconnect);
        }
    };
    
    const handleClearQuantity = (productId) => {
        const product = products.find(p => p.productId === productId);
    
        if (product) {
            updateProductQuantityInFirebase(productId, 0, 0);
            updateTotalAmountAndQuantity(kdwconnect);
        }
    };
    
    return (
        <div>
                  <div className="text-center py-4">
        <span className="text-green-700 font-bold text-lg">POS</span>
      </div>
      <div className="h-0.5 bg-green-500"></div>
            <div className="bg-green-500 justify-around m-2 rounded-2xl p-1 flex">
                <button id="reviewButton" className="bg-white p-1 rounded-xl text-green-600 text-sm">REVIEW</button>
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
                <div key={product.productId} className="container mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                        {/* Your product JSX */}
                        <img
                            id={`product${product.productId}`}
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
                                        onClick={() => handleQuantityChange(product.productId, 'subtract')}
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        className="text-xs p-1 border border-gray-300 rounded-none w-8 text-center"
                                        value={product.pos_app_qty}
                                        readOnly
                                    />
                                    <button
                                        className="text-xs px-2 py-1 bg-blue-500 text-white rounded-r"
                                        onClick={() => handleQuantityChange(product.productId, 'add')}
                                    >
                                        +
                                    </button>
                                </div>
                                <div className="flex items-center mt-2">
                                    <button
                                        className="text-xs px-2 py-1 bg-green-500 text-white rounded"
                                        onClick={() => handleSaveQuantity(product.productId)}
                                    >
                                        <i className="material-icons" style={{ fontSize: '10px' }}>save</i>
                                    </button>
                                    <button
                                        className="text-xs px-2 py-1 bg-gray-500 text-white rounded"
                                        onClick={() => handleClearQuantity(product.productId)}
                                    >
                                        <i className="material-icons" style={{ fontSize: '10px' }}>clear</i>
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
