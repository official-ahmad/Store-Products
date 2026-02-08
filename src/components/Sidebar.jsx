import React from "react";

const Sidebar = ({
  setSelectedCategory,
  selectedCategory,
  isOpen,
  setIsOpen,
}) => {
  const categories = [
    "All",
    "electronics",
    "jewelery",
    "men's clothing",
    "women's clothing",
  ];

  return (
    <>
      {/* Overlay: Jab Sidebar khule toh baqi screen halki dark ho jaye */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <aside
        className={`
        fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-2xl p-6
        transition-transform duration-300 ease-in-out border-r border-gray-100
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
      `}
      >
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="bg-blue-100 p-1.5 rounded-lg text-sm">📂</span>{" "}
            Categories
          </h3>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setIsOpen(false); // Category select hote hi band ho jaye
              }}
              className={`text-left px-5 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 capitalize ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                  : "text-gray-500 hover:bg-blue-50 hover:text-blue-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
