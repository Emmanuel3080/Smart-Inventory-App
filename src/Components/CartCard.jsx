import React, { useState } from 'react';

const CartComponent = ({ product }) => {
    const [items, setItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const pushCart = (productToAdd) => {
        setItems((prevItems) => [...prevItems, productToAdd]);
        setIsCartOpen(true);
    };

    return (
        <div className="relative">
            {/* Button to trigger adding item & opening cart */}
            <div className='mt-3 flex items-center justify-center'>
                <button
                    className='text-sm bg-slate-600 px-2 py-2 w-full rounded-3xl text-amber-50 font-bold cursor-pointer'
                    onClick={() => pushCart(product)}
                >
                    Process Sale
                </button>
            </div>

           
            {isCartOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 transition-opacity"
                    onClick={() => setIsCartOpen(false)}
                />
            )}

            {/* Slide-in / Slide-out Cart Panel */}
            <div
                className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Cart Header */}
                <div className="p-4 border-b flex justify-between items-center bg-slate-100">
                    <h2 className="font-bold text-lg text-slate-800">Your Cart</h2>
                    <button
                        onClick={() => setIsCartOpen(false)}
                        className="text-slate-500 hover:text-slate-800 font-bold text-xl cursor-pointer"
                    >
                        &times;
                    </button>
                </div>

                {/* Cart Items List */}
                <div className="p-4 overflow-y-auto h-[calc(100vh-80px)]">
                    {items.length === 0 ? (
                        <p className="text-slate-500 text-center mt-10">Your cart is empty</p>
                    ) : (
                        items.map((item, index) => (
                            <div key={index} className="py-2 border-b flex justify-between items-center">
                                <span className="text-slate-700 font-medium">{item.productName}</span>
                                <span className="text-slate-500 text-sm">${item.price || '0.00'}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default CartComponent;