import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaPlus,
  FaSignOutAlt,
  FaBoxOpen,
  FaChartLine,
  FaBars,
  FaTimes,
  FaEdit,
  FaTrash,
  FaSearch,
} from "react-icons/fa";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const API = "https://store-backend-7eig.onrender.com/api/admin/products";
const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

/* ─── Sparkline ─────────────────────────────────────────────── */
const Sparkline = ({ data, color }) => {
  const w = 80,
    h = 32,
    max = Math.max(...data),
    min = Math.min(...data);
  const pts = data
    .map(
      (v, i) =>
        `${(i / (data.length - 1)) * w},${h - ((v - min) / (max - min || 1)) * h}`,
    )
    .join(" ");
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{ overflow: "visible" }}
    >
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <polyline
        points={`0,${h} ${pts} ${w},${h}`}
        fill={color}
        fillOpacity="0.08"
        strokeWidth="0"
      />
    </svg>
  );
};

/* ─── ProductModal ───────────────────────────────────────────── */
const EMPTY = {
  title: "",
  price: "",
  category: "",
  image: "",
  description: "",
  stock: "",
  discount: "",
  rating: "",
};

const ProductModal = ({ mode, initialData, onClose, onSuccess }) => {
  const isEdit = mode === "edit";
  const [form, setForm] = useState(
    isEdit
      ? {
          ...initialData,
          rating: initialData.rating?.rate ?? initialData.rating ?? "",
          stock: initialData.stock ?? "",
          discount: initialData.discount ?? "",
        }
      : { ...EMPTY },
  );
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Required";
    if (!form.price || isNaN(form.price) || Number(form.price) < 0)
      e.price = "Valid price required";
    if (!form.category.trim()) e.category = "Required";
    if (!form.image.trim()) e.image = "Required";
    if (form.stock !== "" && (isNaN(form.stock) || Number(form.stock) < 0))
      e.stock = "Must be ≥ 0";
    if (
      form.discount !== "" &&
      (isNaN(form.discount) ||
        Number(form.discount) < 0 ||
        Number(form.discount) > 100)
    )
      e.discount = "Must be 0–100";
    if (
      form.rating !== "" &&
      (isNaN(form.rating) || Number(form.rating) < 0 || Number(form.rating) > 5)
    )
      e.rating = "Must be 0–5";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const set = (field, val) => {
    setForm((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        price: Number(form.price),
        category: form.category.trim(),
        image: form.image.trim(),
        description: form.description.trim(),
        ...(form.stock !== "" && { stock: Number(form.stock) }),
        ...(form.discount !== "" && { discount: Number(form.discount) }),
        ...(form.rating !== "" && {
          rating: { rate: Number(form.rating), count: 0 },
        }),
      };
      if (isEdit) {
        await axios.put(
          `${API}/update/${initialData._id}`,
          payload,
          authHeader(),
        );
        toast.success("Product updated!", { autoClose: 1000 });
      } else {
        await axios.post(`${API}/add`, payload, authHeader());
        toast.success("Product added!", { autoClose: 1000 });
      }
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong!");
    } finally {
      setSaving(false);
    }
  };

  const Field = ({ label, field, type = "text", placeholder, span }) => (
    <div style={{ gridColumn: span === 2 ? "1/-1" : undefined }}>
      <label className="modal-label">{label}</label>
      {field === "description" ? (
        <textarea
          className={`modal-input ${errors[field] ? "err" : ""}`}
          rows={3}
          placeholder={placeholder}
          value={form[field]}
          onChange={(e) => set(field, e.target.value)}
        />
      ) : (
        <input
          type={type}
          className={`modal-input ${errors[field] ? "err" : ""}`}
          placeholder={placeholder}
          value={form[field]}
          onChange={(e) => set(field, e.target.value)}
        />
      )}
      {errors[field] && <span className="modal-err">{errors[field]}</span>}
    </div>
  );

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-box">
        <div className="modal-head">
          <span className="modal-title">
            {isEdit ? "Edit Product" : "Add Product"}
          </span>
          <button className="modal-close" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="modal-grid">
            <Field
              label="Title"
              field="title"
              placeholder="Product title"
              span={2}
            />
            <Field
              label="Price ($)"
              field="price"
              type="number"
              placeholder="0.00"
            />
            <Field
              label="Category"
              field="category"
              placeholder="e.g. electronics"
            />
            <Field
              label="Image URL"
              field="image"
              placeholder="https://..."
              span={2}
            />
            <Field
              label="Description"
              field="description"
              placeholder="Product description..."
              span={2}
            />
            <Field
              label="Stock (optional)"
              field="stock"
              type="number"
              placeholder="0"
            />
            <Field
              label="Discount % (optional)"
              field="discount"
              type="number"
              placeholder="0"
            />
            <Field
              label="Rating (0–5, optional)"
              field="rating"
              type="number"
              placeholder="4.5"
            />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? "Saving..." : isEdit ? "Update" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ─── AdminDashboard ─────────────────────────────────────────── */
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    setMounted(true);
    fetchProducts();
    const clock = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(clock);
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API}/all`);
      setProducts(res.data);
    } catch {
      toast.error("Failed to fetch products!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id, title) => {
    Swal.fire({
      title: "Delete Product?",
      text: `"${title}" will be permanently removed.`,
      icon: "warning",
      background: "#0d1117",
      color: "#e2e8f0",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#3b82f6",
      confirmButtonText: "Delete",
    }).then(async ({ isConfirmed }) => {
      if (!isConfirmed) return;
      try {
        await axios.delete(`${API}/delete/${id}`, authHeader());
        toast.error("Product deleted!", { autoClose: 1000 });
        fetchProducts();
      } catch {
        toast.error("Cannot delete product!");
      }
    });
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Logout?",
      text: "End your admin session?",
      icon: "warning",
      background: "#0d1117",
      color: "#e2e8f0",
      showCancelButton: true,
      confirmButtonColor: "#3b82f6",
      confirmButtonText: "Yes, Logout",
    }).then(({ isConfirmed }) => {
      if (!isConfirmed) return;
      localStorage.removeItem("token");
      toast.success("Logged out!", { autoClose: 1000 });
      navigate("/");
    });
  };

  const filtered = products.filter(
    (p) =>
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const categories = [
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];
  const avgPrice = products.length
    ? (products.reduce((s, p) => s + p.price, 0) / products.length).toFixed(2)
    : "0.00";
  const avgRating = products.length
    ? (
        products.reduce((s, p) => s + (p.rating?.rate || 0), 0) /
        products.length
      ).toFixed(1)
    : "0.0";

  const sp = {
    products: [4, 7, 5, 9, 8, 12, 10, 14, 13, products.length],
    revenue: [20, 35, 28, 45, 38, 55, 60, 52, 68, 72],
    rating: [3, 4, 3.5, 4.2, 4.0, 4.5, 4.3, 4.7, 4.6, Number(avgRating)],
    cats: [
      1,
      2,
      2,
      3,
      3,
      4,
      4,
      categories.length,
      categories.length,
      categories.length,
    ],
  };

  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Outfit:wght@400;500;600;700;800&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg:#070b12; --sf:#0d1117; --sf2:#111827; --sf3:#1a2235;
      --bd:rgba(255,255,255,0.06); --bd2:rgba(255,255,255,0.10);
      --tx:#e2e8f0; --mu:#4b5a6e; --mu2:#64748b;
      --bl:#3b82f6; --bld:rgba(59,130,246,0.12);
      --gr:#10b981; --grd:rgba(16,185,129,0.12);
      --am:#f59e0b; --rd:#ef4444; --rdd:rgba(239,68,68,0.12);
      --mono:'JetBrains Mono',monospace; --sans:'Outfit',sans-serif;
      --sw:240px;
    }
    .dash-root { display:flex; min-height:100vh; background:var(--bg); font-family:var(--sans); color:var(--tx); overflow-x:hidden; }
    .sidebar { position:fixed; inset-y:0; left:0; width:var(--sw); background:var(--sf); border-right:1px solid var(--bd); display:flex; flex-direction:column; transition:transform .3s; z-index:100; }
    .sidebar.closed { transform:translateX(-100%); }
    @media(max-width:768px){.sidebar{transform:translateX(-100%);} .sidebar.open{transform:translateX(0);}}
    .sb-logo { padding:20px 18px; border-bottom:1px solid var(--bd); display:flex; align-items:center; gap:10px; }
    .sb-logo-icon { width:34px; height:34px; background:linear-gradient(135deg,var(--bl),#6366f1); border-radius:9px; display:flex; align-items:center; justify-content:center; }
    .sb-logo-text { font-family:var(--mono); font-size:12px; font-weight:700; color:var(--tx); letter-spacing:1px; }
    .sb-nav { flex:1; padding:12px 8px; display:flex; flex-direction:column; gap:2px; }
    .nav-btn { display:flex; align-items:center; gap:10px; width:100%; padding:10px 12px; border-radius:9px; border:none; background:transparent; color:var(--mu2); font-family:var(--sans); font-size:13.5px; font-weight:500; cursor:pointer; transition:all .18s; text-align:left; }
    .nav-btn:hover { background:var(--sf3); color:var(--tx); }
    .nav-btn.active { background:var(--bld); color:var(--bl); border:1px solid rgba(59,130,246,.2); }
    .sb-bottom { padding:12px 8px 16px; border-top:1px solid var(--bd); }
    .main { flex:1; margin-left:var(--sw); transition:margin-left .3s; min-height:100vh; display:flex; flex-direction:column; }
    .main.full { margin-left:0; }
    @media(max-width:768px){ .main{margin-left:0!important;} }
    .topbar { position:sticky; top:0; height:60px; background:rgba(7,11,18,.9); backdrop-filter:blur(20px); border-bottom:1px solid var(--bd); display:flex; align-items:center; padding:0 20px; gap:10px; z-index:50; }
    .tb-toggle { width:34px; height:34px; background:var(--sf2); border:1px solid var(--bd2); border-radius:8px; display:flex; align-items:center; justify-content:center; color:var(--mu2); cursor:pointer; transition:all .18s; }
    .tb-toggle:hover { background:var(--sf3); color:var(--tx); }
    .tb-search { flex:1; max-width:320px; position:relative; }
    .tb-search svg { position:absolute; left:10px; top:50%; transform:translateY(-50%); color:var(--mu); font-size:12px; pointer-events:none; }
    .tb-search input { width:100%; background:var(--sf2); border:1px solid var(--bd); border-radius:8px; color:var(--tx); font-family:var(--sans); font-size:13px; padding:8px 12px 8px 32px; outline:none; transition:border-color .2s; }
    .tb-search input::placeholder { color:var(--mu); }
    .tb-search input:focus { border-color:rgba(59,130,246,.4); }
    .tb-right { margin-left:auto; display:flex; align-items:center; gap:8px; }
    .clock { font-family:var(--mono); font-size:11px; color:var(--mu2); background:var(--sf2); border:1px solid var(--bd); border-radius:7px; padding:5px 10px; }
    @media(max-width:580px){.clock{display:none;}}
    .content { padding:20px; flex:1; max-width:1400px; width:100%; margin:0 auto; opacity:0; transform:translateY(12px); transition:opacity .4s,transform .4s; }
    .content.mounted { opacity:1; transform:translateY(0); }
    .page-header { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:20px; flex-wrap:wrap; }
    .page-title { font-size:22px; font-weight:800; color:var(--tx); letter-spacing:-.5px; }
    .page-sub { font-size:12px; color:var(--mu2); margin-top:3px; }
    .add-btn { display:flex; align-items:center; gap:7px; background:var(--bl); color:#fff; font-family:var(--sans); font-size:13px; font-weight:600; padding:9px 16px; border-radius:9px; border:none; cursor:pointer; transition:all .18s; box-shadow:0 4px 14px rgba(59,130,246,.3); white-space:nowrap; }
    .add-btn:hover { background:#2563eb; transform:translateY(-1px); }
    .stats-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(190px,1fr)); gap:12px; margin-bottom:18px; }
    .stat-card { background:var(--sf); border:1px solid var(--bd); border-radius:12px; padding:18px; transition:border-color .2s,transform .2s; }
    .stat-card:hover { border-color:var(--bd2); transform:translateY(-2px); }
    .stat-label { font-family:var(--mono); font-size:10px; color:var(--mu); text-transform:uppercase; letter-spacing:1.5px; margin-bottom:8px; }
    .stat-val { font-size:28px; font-weight:800; color:var(--tx); letter-spacing:-1px; line-height:1; }
    .stat-spark { margin-top:10px; border-top:1px solid var(--bd); padding-top:10px; }
    .table-card { background:var(--sf); border:1px solid var(--bd); border-radius:12px; overflow:hidden; }
    .table-head { padding:16px 20px; border-bottom:1px solid var(--bd); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px; }
    .table-title { font-size:14px; font-weight:700; color:var(--tx); }
    .table-badge { background:var(--bld); border:1px solid rgba(59,130,246,.2); color:var(--bl); font-family:var(--mono); font-size:11px; font-weight:700; padding:3px 10px; border-radius:100px; }
    table { width:100%; border-collapse:collapse; }
    thead tr { background:rgba(255,255,255,.02); border-bottom:1px solid var(--bd); }
    th { padding:11px 18px; text-align:left; font-family:var(--mono); font-size:10px; font-weight:700; color:var(--mu); text-transform:uppercase; letter-spacing:1.5px; white-space:nowrap; }
    tbody tr { border-bottom:1px solid var(--bd); transition:background .15s; }
    tbody tr:last-child { border-bottom:none; }
    tbody tr:hover { background:rgba(255,255,255,.02); }
    td { padding:12px 18px; vertical-align:middle; }
    .prod-img { width:40px; height:40px; background:var(--sf2); border:1px solid var(--bd); border-radius:8px; display:flex; align-items:center; justify-content:center; overflow:hidden; }
    .prod-img img { width:100%; height:100%; object-fit:contain; }
    .prod-name { font-size:13px; font-weight:600; color:var(--tx); max-width:170px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .prod-id { font-family:var(--mono); font-size:10px; color:var(--mu); margin-top:2px; }
    .cat-tag { display:inline-block; background:var(--sf3); border:1px solid var(--bd2); color:var(--mu2); font-family:var(--mono); font-size:10px; font-weight:600; padding:2px 8px; border-radius:5px; text-transform:uppercase; }
    .price-val { font-family:var(--mono); font-size:13px; font-weight:700; color:var(--gr); }
    .rating-val { font-family:var(--mono); font-size:11px; color:var(--am); }
    .action-btn { width:30px; height:30px; border-radius:7px; border:1px solid var(--bd); background:var(--sf2); display:flex; align-items:center; justify-content:center; cursor:pointer; transition:all .15s; font-size:12px; }
    .action-btn.edit { color:var(--bl); } .action-btn.edit:hover { background:var(--bld); border-color:rgba(59,130,246,.3); }
    .action-btn.del { color:var(--rd); } .action-btn.del:hover { background:var(--rdd); border-color:rgba(239,68,68,.3); }
    .empty-state { padding:48px; text-align:center; color:var(--mu2); font-family:var(--mono); font-size:13px; }
    .loader { padding:48px; display:flex; justify-content:center; gap:6px; }
    .loader span { width:7px; height:7px; background:var(--bl); border-radius:50%; animation:bounce 1.2s ease infinite; }
    .loader span:nth-child(2){animation-delay:.2s;} .loader span:nth-child(3){animation-delay:.4s;}
    @keyframes bounce{0%,80%,100%{transform:scale(.6);opacity:.4;}40%{transform:scale(1);opacity:1;}}
    @media(max-width:640px){.hide-sm{display:none;} td,th{padding:10px 10px;}}
    .modal-backdrop { position:fixed; inset:0; background:rgba(0,0,0,.78); backdrop-filter:blur(8px); z-index:500; display:flex; align-items:center; justify-content:center; padding:16px; animation:fadein .2s; }
    @keyframes fadein{from{opacity:0}to{opacity:1}}
    .modal-box { background:#0d1117; border:1px solid rgba(255,255,255,.09); border-radius:16px; width:100%; max-width:600px; max-height:92vh; overflow:hidden; display:flex; flex-direction:column; animation:slideup .25s cubic-bezier(.4,0,.2,1); }
    @keyframes slideup{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
    .modal-head { padding:18px 22px; border-bottom:1px solid rgba(255,255,255,.07); display:flex; align-items:center; justify-content:space-between; }
    .modal-title { font-size:16px; font-weight:700; color:var(--tx); }
    .modal-close { width:30px; height:30px; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); border-radius:7px; display:flex; align-items:center; justify-content:center; color:var(--mu2); cursor:pointer; transition:all .15s; font-size:13px; }
    .modal-close:hover { background:var(--rdd); color:var(--rd); }
    .modal-body { overflow-y:auto; padding:20px 22px; flex:1; }
    .modal-body::-webkit-scrollbar{width:4px;} .modal-body::-webkit-scrollbar-thumb{background:#1a2235;border-radius:100px;}
    .modal-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
    @media(max-width:480px){.modal-grid{grid-template-columns:1fr;}}
    .modal-label { display:block; font-family:var(--mono); font-size:10px; font-weight:600; color:var(--mu); text-transform:uppercase; letter-spacing:1px; margin-bottom:6px; }
    .modal-input { width:100%; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); border-radius:9px; color:var(--tx); font-family:var(--sans); font-size:13.5px; padding:10px 13px; outline:none; transition:border-color .2s,background .2s; resize:vertical; }
    .modal-input::placeholder{color:var(--mu);} .modal-input:focus{border-color:rgba(59,130,246,.5);background:rgba(59,130,246,.04);}
    .modal-input.err { border-color:rgba(239,68,68,.4); }
    .modal-err { font-family:var(--mono); font-size:10px; color:var(--rd); margin-top:4px; display:block; }
    .modal-footer { display:flex; gap:10px; justify-content:flex-end; margin-top:18px; border-top:1px solid rgba(255,255,255,.06); padding-top:16px; }
    .btn-ghost { padding:9px 18px; border-radius:9px; border:1px solid var(--bd2); background:transparent; color:var(--mu2); font-family:var(--sans); font-size:13px; font-weight:500; cursor:pointer; transition:all .15s; }
    .btn-ghost:hover { background:var(--sf3); color:var(--tx); }
    .btn-primary { padding:9px 20px; border-radius:9px; border:none; background:var(--bl); color:#fff; font-family:var(--sans); font-size:13px; font-weight:600; cursor:pointer; transition:all .15s; box-shadow:0 4px 14px rgba(59,130,246,.3); }
    .btn-primary:hover:not(:disabled){background:#2563eb;transform:translateY(-1px);}
    .btn-primary:disabled{opacity:.6;cursor:not-allowed;}
    .status-dot { width:6px; height:6px; background:var(--gr); border-radius:50%; box-shadow:0 0 6px var(--gr); animation:blink 2.5s ease infinite; flex-shrink:0; }
    @keyframes blink{0%,100%{opacity:1}50%{opacity:.4}}
    .overlay { display:none; position:fixed; inset:0; background:rgba(0,0,0,.6); z-index:99; }
    @media(max-width:768px){.overlay.show{display:block;}}
  `;

  return (
    <div className="dash-root">
      <style>{CSS}</style>

      {/* Sidebar overlay (mobile) */}
      <div
        className={`overlay ${sidebarOpen ? "show" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sb-logo">
          <div className="sb-logo-icon">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <div className="sb-logo-text">ADMIN PANEL</div>
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 9,
                color: "var(--mu)",
                letterSpacing: 2,
                marginTop: 2,
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <span className="status-dot" /> ONLINE
            </div>
          </div>
        </div>

        <nav className="sb-nav">
          <button
            className={`nav-btn ${activeNav === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveNav("dashboard")}
          >
            <FaChartLine style={{ fontSize: 13 }} /> Dashboard
          </button>
          <button
            className={`nav-btn ${activeNav === "products" ? "active" : ""}`}
            onClick={() => setActiveNav("products")}
          >
            <FaBoxOpen style={{ fontSize: 13 }} /> Products
          </button>
        </nav>

        <div className="sb-bottom">
          <button className="nav-btn" onClick={() => navigate("/store")}>
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            View Store
          </button>
          <button
            className="nav-btn"
            style={{ color: "var(--rd)" }}
            onClick={handleLogout}
          >
            <FaSignOutAlt style={{ fontSize: 13 }} /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className={`main ${sidebarOpen ? "" : "full"}`}>
        {/* Topbar */}
        <header className="topbar">
          <button
            className="tb-toggle"
            onClick={() => setSidebarOpen((v) => !v)}
          >
            {sidebarOpen ? <FaTimes size={13} /> : <FaBars size={13} />}
          </button>
          <div className="tb-search">
            <FaSearch />
            <input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="tb-right">
            <div className="clock">{time.toLocaleTimeString()}</div>
          </div>
        </header>

        {/* Content */}
        <div className={`content ${mounted ? "mounted" : ""}`}>
          {activeNav === "dashboard" && (
            <div>
              <div className="page-header">
                <div>
                  <div className="page-title">Dashboard</div>
                  <div className="page-sub">Store overview</div>
                </div>
                <button
                  className="add-btn"
                  onClick={() => setShowAddModal(true)}
                >
                  <FaPlus size={10} /> Add Product
                </button>
              </div>

              <div className="stats-grid">
                {[
                  {
                    label: "Total Products",
                    value: products.length,
                    color: "#3b82f6",
                    data: sp.products,
                  },
                  {
                    label: "Categories",
                    value: categories.length,
                    color: "#10b981",
                    data: sp.cats,
                  },
                  {
                    label: "Avg Price",
                    value: `$${avgPrice}`,
                    color: "#f59e0b",
                    data: sp.revenue,
                  },
                  {
                    label: "Avg Rating",
                    value: `★ ${avgRating}`,
                    color: "#6366f1",
                    data: sp.rating,
                  },
                ].map(({ label, value, color, data }) => (
                  <div key={label} className="stat-card">
                    <div className="stat-label">{label}</div>
                    <div className="stat-val">{value}</div>
                    <div className="stat-spark">
                      <Sparkline data={data} color={color} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent products preview */}
              <div className="table-card">
                <div className="table-head">
                  <div className="table-title">Recent Products</div>
                  <span className="table-badge">{products.length} total</span>
                </div>
                {loading ? (
                  <div className="loader">
                    <span />
                    <span />
                    <span />
                  </div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th className="hide-sm">Category</th>
                        <th>Price</th>
                        <th>Rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.slice(0, 6).map((p) => (
                        <tr key={p._id}>
                          <td>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                              }}
                            >
                              <div className="prod-img">
                                <img src={p.image} alt={p.title} />
                              </div>
                              <div>
                                <div className="prod-name">{p.title}</div>
                                <div className="prod-id">
                                  #{p._id?.slice(-6).toUpperCase()}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="hide-sm">
                            <span className="cat-tag">{p.category}</span>
                          </td>
                          <td>
                            <span className="price-val">${p.price}</span>
                          </td>
                          <td>
                            <span className="rating-val">
                              ★ {p.rating?.rate ?? "—"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {activeNav === "products" && (
            <div>
              <div className="page-header">
                <div>
                  <div className="page-title">Products</div>
                  <div className="page-sub">
                    {filtered.length} of {products.length} products
                  </div>
                </div>
                <button
                  className="add-btn"
                  onClick={() => setShowAddModal(true)}
                >
                  <FaPlus size={10} /> Add Product
                </button>
              </div>

              <div className="table-card">
                <div className="table-head">
                  <div className="table-title">All Products</div>
                  <span className="table-badge">{filtered.length} results</span>
                </div>
                {loading ? (
                  <div className="loader">
                    <span />
                    <span />
                    <span />
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="empty-state">No products found.</div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th className="hide-sm">Category</th>
                        <th>Price</th>
                        <th className="hide-sm">Rating</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((p) => (
                        <tr key={p._id}>
                          <td>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                              }}
                            >
                              <div className="prod-img">
                                <img src={p.image} alt={p.title} />
                              </div>
                              <div>
                                <div className="prod-name">{p.title}</div>
                                <div className="prod-id">
                                  #{p._id?.slice(-6).toUpperCase()}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="hide-sm">
                            <span className="cat-tag">{p.category}</span>
                          </td>
                          <td>
                            <span className="price-val">${p.price}</span>
                          </td>
                          <td className="hide-sm">
                            <span className="rating-val">
                              ★ {p.rating?.rate ?? "—"}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: "flex", gap: 6 }}>
                              <button
                                className="action-btn edit"
                                title="Edit"
                                onClick={() => setEditProduct(p)}
                              >
                                <FaEdit />
                              </button>
                              <button
                                className="action-btn del"
                                title="Delete"
                                onClick={() => handleDelete(p._id, p.title)}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {showAddModal && (
        <ProductModal
          mode="add"
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchProducts}
        />
      )}
      {editProduct && (
        <ProductModal
          mode="edit"
          initialData={editProduct}
          onClose={() => setEditProduct(null)}
          onSuccess={fetchProducts}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
