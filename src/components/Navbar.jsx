  import React, { useState } from "react";
  import Input from "./Input"; // Jo humne search bar banaya tha

  const Navbar = ({ cartCount, cartItems = [], clearCart, setSearchTerm }) => {
    const [isOpen, setIsOpen] = useState(false);
    const categories = [...new Set(cartItems.map((item) => item.category))];

    return (
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 p-3 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center gap-4">
          {/* 1. Logo Section */}
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-gray-800 hidden sm:block">
              STORE<span className="text-blue-600"></span>
            </h1>
          </div>

          {/* 3. Right Section: Navigation & Cart */}
          <div className="flex items-center gap-5">
            {/* Nav Links - Desktop */}
            <div className="hidden lg:flex items-center gap-6 text-sm font-semibold text-gray-600">
              <a href="#" className="hover:text-blue-600 transition-colors">
                Home
              </a>
              <a href="#" className="hover:text-blue-600 transition-colors">
                Flash Sales
              </a>
            </div>

            {/* Cart Icon with Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsOpen(true)}
              onMouseLeave={() => setIsOpen(false)}
              onClick={() => setIsOpen(!isOpen)}
            >
              <div className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer relative">
                <svg
                  className="w-7 h-7 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-blue-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </div>

              {/* Dropdown Summary */}
              <div
                className={`absolute right-0 mt-3 w-72 bg-white border border-gray-100 shadow-2xl rounded-2xl p-5 transition-all duration-300 z-50 
                ${isOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-2"}`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4 text-gray-800">
                  <h3 className="font-bold">My Cart</h3>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-500">
                    {cartCount} Items
                  </span>
                </div>

                {cartCount > 0 ? (
                  <>
                    <div className="space-y-3 mb-5">
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                        Selected Categories
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((cat, index) => (
                          <span
                            key={index}
                            className="bg-blue-50 text-blue-700 text-[10px] px-2.5 py-1 rounded-full border border-blue-100 capitalize"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        clearCart();
                        setIsOpen(false);
                      }}
                      className="w-full py-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl hover:bg-red-600 hover:text-white transition-all duration-300"
                    >
                      Clear All & Restart
                    </button>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-400">Your cart is empty</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  };

  export default Navbar;
