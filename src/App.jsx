import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Admin from "./components/Admin";
import Navbar from "./components/Navbar";
import Product from "./components/Products";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import toast from "react-hot-toast";
import AdminDashboard from "./pages/Admin-Dashboard";

function App() {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("myCart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("myCart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    const isExist = cart.find((item) => item.id === product.id);
    if (isExist) {
      toast.error("Item already in cart!");
    } else {
      setCart([...cart, product]);
      toast.success(`${product.title.slice(0, 20)}... added!`);
    }
  };

  const clearCart = () => {
    setCart([]);
    toast.error("Cart cleared!");
  };

  return (
    <Router>
      <div className="bg-gray-50 min-h-screen relative">
        <ToastContainer />

        <Routes>
          <Route path="/" element={<Admin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />

          <Route
            path="/store"
            element={
              <>
                <Navbar
                  cartCount={cart.length}
                  cartItems={cart}
                  clearCart={clearCart}
                  toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                />
                <div className="flex container mx-auto">
                  <Sidebar
                    setSelectedCategory={setSelectedCategory}
                    selectedCategory={selectedCategory}
                    isOpen={isSidebarOpen}
                    setIsOpen={setIsSidebarOpen}
                  />
                  <main className="flex-1">
                    <Product
                      addToCart={addToCart}
                      selectedCategory={selectedCategory}
                      toggleSidebar={() => setIsSidebarOpen(true)}
                    />
                  </main>
                </div>
                <Footer />
              </>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
