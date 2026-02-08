import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBoxOpen,
  FaPlus,
  FaSignOutAlt,
  FaStore,
  FaChartLine,
} from "react-icons/fa";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of the Admin Panel!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6", // Blue color
      cancelButtonColor: "#d33", // Red color
      confirmButtonText: "Yes, logout!",
      cancelButtonText: "Cancel",
      background: "#fff",
      color: "#000",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");

        Swal.fire({
          title: "Logged Out!",
          text: "Redirecting to login...",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        toast.warning("Redirecting to login...", { autoClose: 1500 });

        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <div className="w-64 bg-gray-800 text-white p-6 flex flex-col fixed h-full">
        <h2 className="text-2xl font-bold text-indigo-400 text-center mb-10">
          Admin Dashboard
        </h2>

        <nav className="flex flex-col gap-4 flex-grow">
          <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-700 transition-colors text-left">
            <FaBoxOpen /> Manage Products
          </button>
          <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-700 transition-colors text-left">
            <FaPlus /> Add New Product
          </button>

          <div className="mt-auto flex flex-col gap-3">
            <button
              onClick={() => {
                toast.info("Directed to store...", { autoClose: 1500 });

                navigate("/store");
              }}
              className="flex items-center gap-3 w-full p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              <FaStore /> View Store
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full p-3 rounded-lg bg-red-800 hover:bg-red-700 transition-colors"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </nav>
      </div>

      <div className="flex-1 ml-64 p-10">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, Admin!
          </h1>
          <span className="bg-green-100 text-green-800 px-4 py-1 rounded-full text-sm font-bold shadow-sm">
            ● Online
          </span>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-sm border-b-4 border-indigo-500">
            <p className="text-gray-500 font-medium mb-2">Total Products</p>
            <h2 className="text-4xl font-bold text-gray-800">24</h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border-b-4 border-emerald-500">
            <p className="text-gray-500 font-medium mb-2">Inventory Value</p>
            <h2 className="text-4xl font-bold text-gray-800">$12,450</h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border-b-4 border-red-500">
            <p className="text-gray-500 font-medium mb-2">Out of Stock</p>
            <h2 className="text-4xl font-bold text-gray-800">02</h2>
          </div>
        </div>
        <div className="bg-white p-10 rounded-2xl shadow-md text-center border border-gray-100">
          <div className="flex justify-center mb-4">
            <FaChartLine className="text-gray-200 text-6xl" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Recent Management Activity
          </h3>
          <p className="text-gray-400">
            Abhi yahan hum products ki list aur unhein delete karne ka button
            lagayenge.
          </p>
          <button className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-all shadow-lg">
            Refresh Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
