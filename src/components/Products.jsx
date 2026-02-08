import { useState, useEffect } from "react";
import Input from "./Input";
import Cart from "./Cart";

function ProductList({ addToCart, selectedCategory, toggleSidebar }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  // Filter logic: Pehle Category check hogi, phir Search
  const filteredProducts = products.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        {/* Header Section */}
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 w-full">
          {/* Left Side: Bars Button + Title */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="p-2.5 bg-white shadow-md border border-gray-100 rounded-xl text-blue-600 hover:bg-blue-50 active:scale-90 transition-all flex-shrink-0"
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 border-b-4 border-blue-500 pb-1 capitalize tracking-tight whitespace-nowrap">
              {searchTerm ? `Results: ${searchTerm}` : `${selectedCategory}`}
            </h2>
          </div>

          {/* Right Side: Search Bar - Forced to extreme right */}
          <div className="w-full md:w-auto md:flex-1 flex justify-center md:justify-end">
            <div className="w-full max-w-xs md:max-w-none md:w-80">
              <Input setSearchTerm={setSearchTerm} />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden border border-gray-100"
              >
                <div className="relative h-56 md:h-64 p-6 bg-white overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-blue-600 text-white text-[10px] px-2 py-1 rounded-full uppercase font-bold tracking-widest shadow-lg">
                    {item.category}
                  </span>
                </div>

                <div className="p-5 flex flex-col flex-grow bg-white border-t border-gray-50">
                  <h3 className="font-bold text-gray-800 text-sm line-clamp-2 h-10 leading-tight mb-2">
                    {item.title}
                  </h3>

                  <p className="text-gray-500 text-xs line-clamp-2 mb-4 flex-grow">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50 mb-4">
                    <span className="text-xl font-bold text-gray-900">
                      ${item.price}
                    </span>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center bg-yellow-50 px-2 py-1 rounded text-yellow-700">
                        <span className="text-xs font-bold">
                          ★ {item.rating?.rate}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Cart item={item} addToCart={addToCart} />
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl text-gray-500 font-medium">
                No products found in "{selectedCategory}"
              </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductList;
