import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBoxOpen,
  FaPlus,
  FaSignOutAlt,
  FaStore,
  FaChartLine,
  FaEdit,
  FaTrash,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Access Denied! Please login as Admin", { autoClose: 1000 });
      setTimeout(() => {
        navigate("/login");
      });
    }
  }, [navigate]);

  const productData = [
    { name: "Electronics", sales: 400, stock: 24 },
    { name: "Clothing", sales: 300, stock: 13 },
    { name: "Home", sales: 200, stock: 98 },
    { name: "Jewelery", sales: 278, stock: 39 },
  ];

  const recentProducts = [
    {
      id: 1,
      name: "Backpack",
      category: "Electronics",
      price: "$100",
      stock: 24,
    },
    { id: 2, name: "T-Shirt", category: "Clothing", price: "$50", stock: 13 },
    { id: 3, name: "Jacket", category: "Home", price: "$75", stock: 98 },
  ];

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of the Admin Panel!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        toast.success("Logged out sucessfully", { autoClose: 1000 });
        setTimeout(() => {
          navigate("/");
        });
      }
    });
  };

  const handleEdit = (id) => toast.info(`Editing product ${id}`);

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete Product?",
      text: "This will remove the item from your store!",
      icon: "error",
      showCancelButton: true,
      confirmButtonText: "Yes, delete!",
    }).then((result) => {
      if (result.isConfirmed) toast.success(`Product ${id} deleted`);
    });
  };

  if (!localStorage.getItem("token")) return null;

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans overflow-x-hidden">
      <div
        className={`bg-gray-800 text-white flex flex-col fixed h-full transition-all duration-300 z-50 shadow-2xl ${isSidebarOpen ? "w-64" : "w-0 -translate-x-full"}`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-xl font-bold text-indigo-400">Admin Panel</h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-white"
            >
              <FaTimes />
            </button>
          </div>

          <nav className="flex flex-col gap-4">
            <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-700 transition-all">
              <FaBoxOpen /> Manage Products
            </button>
            <button className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-gray-700 transition-all">
              <FaPlus /> Add New Product
            </button>

            <div className="mt-40 border-t border-gray-700 pt-4 flex flex-col gap-3">
              <button
                onClick={() => {
                  toast.info("Navigating to Store...", { autoClose: 1000 });
                  setTimeout(() => {
                    navigate("/store");
                  });
                }}
                className="flex items-center gap-3 w-full p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-all"
              >
                <FaStore /> View Store
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full p-3 rounded-lg bg-red-800 hover:bg-red-700 transition-all"
              >
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </nav>
        </div>
      </div>

      <div
        className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"} p-4 md:p-10`}
      >
        <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
            >
              <FaBars className="text-gray-700" />
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
              Welcome back, Admin!
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
              Online
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-sm border-l-8 border-indigo-500 hover:scale-105 transition-transform">
            <p className="text-gray-400 text-sm font-bold uppercase">
              Total Products
            </p>
            <h2 className="text-3xl font-black text-gray-800">24</h2>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border-l-8 border-emerald-500 hover:scale-105 transition-transform">
            <p className="text-gray-400 text-sm font-bold uppercase">
              Inventory Value
            </p>
            <h2 className="text-3xl font-black text-gray-800">$12,450</h2>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border-l-8 border-red-500 hover:scale-105 transition-transform">
            <p className="text-gray-400 text-sm font-bold uppercase">
              Low Stock Items
            </p>
            <h2 className="text-3xl font-black text-gray-800">02</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-700 mb-6 flex items-center gap-2">
              <FaChartLine className="text-indigo-500" /> Category Sales
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip cursor={{ fill: "#f3f4f6" }} />
                <Bar dataKey="sales" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <h3 className="text-lg font-bold text-gray-700 mb-6">
              Recently Added
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-gray-400 border-b text-sm uppercase">
                    <th className="pb-3">Product</th>
                    <th className="pb-3">Price</th>
                    <th className="pb-3">Stock</th>
                    <th className="pb-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600">
                  {recentProducts.map((p) => (
                    <tr
                      key={p.id}
                      className="border-b last:border-0 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 font-medium">{p.name}</td>
                      <td className="py-4 text-emerald-600 font-bold">
                        {p.price}
                      </td>
                      <td className="py-4">
                        <span
                          className={`px-2 py-1 rounded-md text-xs ${p.stock < 15 ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"}`}
                        >
                          {p.stock} in stock
                        </span>
                      </td>
                      <td className="py-4 flex justify-center gap-4">
                        <button
                          onClick={() => handleEdit(p.id)}
                          className="text-indigo-500 hover:scale-125 transition-transform"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="text-red-500 hover:scale-125 transition-transform"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
