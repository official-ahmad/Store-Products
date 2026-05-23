import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./index.css";
import Admin from "./components/Admin";
import Navbar from "./components/Navbar";
import Product from "./components/Products";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import AdminDashboard from "./pages/Admin-Dashboard";
import UserAuth from "./pages/UserAuth";
import UserDashboard from "./pages/UserDashboard";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";

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
    const existing = cart.find((item) => item._id === product._id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item,
        ),
      );
      toast.success("Quantity updated!", { autoClose: 800 });
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
      toast.success(`${product.title.slice(0, 20)}... added!`, {
        autoClose: 800,
      });
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item._id !== productId));
    toast.info("Item removed from cart", { autoClose: 800 });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(
        cart.map((item) =>
          item._id === productId ? { ...item, quantity: newQuantity } : item,
        ),
      );
    }
  };

  const clearCart = () => {
    setCart([]);
    toast.warning("Cart cleared!", { autoClose: 800 });
  };

  const handleCheckout = () => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      Swal.fire({
        title: "Login Required",
        text: "Please login or create an account to proceed with checkout",
        icon: "info",
        background: "#fff",
        color: "#333",
        showCancelButton: true,
        confirmButtonColor: "#3b82f6",
        cancelButtonColor: "#666",
        confirmButtonText: "Login/Sign Up",
        cancelButtonText: "Continue Shopping",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/user-login";
        }
      });
    } else {
      window.location.href = "/user-dashboard";
    }
  };

  return (
    <Router>
      <div className="bg-gray-50 min-h-screen relative">
        <ToastContainer />

        <Routes>
          {/* Main Store */}
          <Route
            path="/"
            element={
              <>
                <Navbar
                  cartCount={cart.length}
                  cartItems={cart}
                  clearCart={clearCart}
                  removeFromCart={removeFromCart}
                  updateQuantity={updateQuantity}
                  onCheckout={handleCheckout}
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

          {/* User Routes */}
          <Route path="/user-login" element={<UserAuth />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />

          {/* Admin Routes (Hidden) */}
          <Route path="/admin-login" element={<Admin />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
