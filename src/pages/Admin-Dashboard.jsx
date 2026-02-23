import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
  FaInbox,
  FaShieldAlt,
  FaBell,
  FaSearch,
  FaCog,
  FaDatabase,
  FaImage,
  FaTag,
  FaDollarSign,
  FaLayerGroup,
  FaWarehouse,
  FaPercentage,
  FaAlignLeft,
  FaCheck,
  FaExclamationTriangle,
  FaEnvelope,
  FaUserShield,
  FaSignInAlt,
  FaStar,
  FaServer,
  FaTable,
  FaLock,
  FaKey,
  FaToggleOn,
  FaToggleOff,
  FaSave,
  FaReply,
  FaTrashAlt,
  FaCheckDouble,
  FaWifi,
  FaHdd,
} from "react-icons/fa";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const Sparkline = ({ data, color }) => {
  const w = 80,
    h = 32;
  const max = Math.max(...data),
    min = Math.min(...data);
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / (max - min || 1)) * h;
      return `${x},${y}`;
    })
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

const Donut = ({ pct, color }) => {
  const r = 18,
    c = 2 * Math.PI * r;
  return (
    <svg width="48" height="48" viewBox="0 0 48 48">
      <circle
        cx="24"
        cy="24"
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth="4"
      />
      <circle
        cx="24"
        cy="24"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeDasharray={`${(c * pct) / 100} ${c}`}
        strokeLinecap="round"
        transform="rotate(-90 24 24)"
      />
      <text
        x="24"
        y="29"
        textAnchor="middle"
        fill={color}
        fontSize="10"
        fontWeight="700"
        fontFamily="monospace"
      >
        {pct}%
      </text>
    </svg>
  );
};

const emptyForm = {
  title: "",
  price: "",
  category: "",
  image: "",
  description: "",
  stock: "",
  discount: "",
  rating: "",
};
const CATEGORIES = [
  "Electronics",
  "Clothing",
  "Footwear",
  "Accessories",
  "Home & Living",
  "Sports",
  "Beauty",
  "Books",
  "Toys",
  "Other",
];

const ProductModal = ({ mode, initialData, onClose, onSuccess }) => {
  const [form, setForm] = useState(
    mode === "edit"
      ? {
          ...initialData,
          rating: initialData.rating?.rate ?? initialData.rating ?? "",
        }
      : { ...emptyForm },
  );
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [imgPreview, setImgPreview] = useState(
    mode === "edit" ? initialData.image : "",
  );
  const isEdit = mode === "edit";

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.price || isNaN(form.price) || Number(form.price) < 0)
      e.price = "Valid price required";
    if (!form.category.trim()) e.category = "Category is required";
    if (!form.image.trim()) e.image = "Image URL is required";
    if (form.stock !== "" && (isNaN(form.stock) || Number(form.stock) < 0))
      e.stock = "Valid stock number";
    if (
      form.discount !== "" &&
      (isNaN(form.discount) ||
        Number(form.discount) < 0 ||
        Number(form.discount) > 100)
    )
      e.discount = "Must be 0-100";
    if (
      form.rating !== "" &&
      (isNaN(form.rating) || Number(form.rating) < 0 || Number(form.rating) > 5)
    )
      e.rating = "Must be 0-5";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field, val) => {
    setForm((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    if (field === "image") setImgPreview(val);
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
        stock: form.stock !== "" ? Number(form.stock) : undefined,
        discount: form.discount !== "" ? Number(form.discount) : undefined,
        rating:
          form.rating !== ""
            ? { rate: Number(form.rating), count: 0 }
            : undefined,
      };
      if (isEdit) {
        await axios.put(
          `http://localhost:8000/api/admin/products/update/${initialData._id}`,
          payload,
        );
        toast.success("Product updated!", { autoClose: 1000 });
      } else {
        await axios.post(
          "http://localhost:8000/api/admin/products/add",
          payload,
        );
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

  const discountedPrice =
    form.price && form.discount
      ? (Number(form.price) * (1 - Number(form.discount) / 100)).toFixed(2)
      : null;

  const renderStars = (rating) => {
    const num = Number(rating);
    if (!rating || isNaN(num)) return null;
    return (
      <div
        style={{ display: "flex", alignItems: "center", gap: 3, marginTop: 6 }}
      >
        {[1, 2, 3, 4, 5].map((s) => (
          <span
            key={s}
            style={{
              fontSize: 11,
              color: s <= Math.round(num) ? "#f59e0b" : "#1e293b",
            }}
          >
            *
          </span>
        ))}
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            color: "var(--am)",
            marginLeft: 3,
          }}
        >
          {num.toFixed(1)}
        </span>
      </div>
    );
  };

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-box">
        <div className="modal-head">
          <div className="modal-head-left">
            <div
              className="modal-icon"
              style={{
                background: isEdit
                  ? "rgba(16,185,129,0.12)"
                  : "rgba(59,130,246,0.12)",
                border: `1px solid ${isEdit ? "rgba(16,185,129,0.25)" : "rgba(59,130,246,0.25)"}`,
                color: isEdit ? "#10b981" : "#3b82f6",
              }}
            >
              {isEdit ? <FaEdit /> : <FaPlus />}
            </div>
            <div>
              <div className="modal-title">
                {isEdit ? "Edit Product" : "Add New Product"}
              </div>
              <div className="modal-sub">
                {isEdit
                  ? `ID: ${initialData._id?.slice(-8).toUpperCase()}`
                  : "Fill in the details below"}
              </div>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <FaTimes size={12} />
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit} id="prod-form">
            <div className="modal-layout">
              <div className="modal-form-area">
                <div className="fields-grid">
                  <div className="field-block field-full">
                    <div className="field-label-row">
                      <label className="field-label">
                        <FaTag className="field-label-icon" /> Product Title
                      </label>
                      <span className="field-req">* required</span>
                    </div>
                    <input
                      className={`field-input ${errors.title ? "field-err" : ""}`}
                      placeholder="e.g. Nike Air Max 2024"
                      value={form.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                    />
                    {errors.title && (
                      <div className="err-msg">
                        <FaExclamationTriangle size={9} /> {errors.title}
                      </div>
                    )}
                  </div>
                  <div className="field-block">
                    <div className="field-label-row">
                      <label className="field-label">
                        <FaDollarSign className="field-label-icon" /> Price
                        (USD)
                      </label>
                      <span className="field-req">* required</span>
                    </div>
                    <div className="field-prefix-wrap">
                      <FaDollarSign className="field-prefix-icon" />
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        className={`field-input field-prefixed ${errors.price ? "field-err" : ""}`}
                        placeholder="0.00"
                        value={form.price}
                        onChange={(e) => handleChange("price", e.target.value)}
                      />
                    </div>
                    {errors.price && (
                      <div className="err-msg">
                        <FaExclamationTriangle size={9} /> {errors.price}
                      </div>
                    )}
                  </div>
                  <div className="field-block">
                    <div className="field-label-row">
                      <label className="field-label">
                        <FaPercentage className="field-label-icon" /> Discount %
                      </label>
                      <span className="field-opt">optional</span>
                    </div>
                    <div className="field-prefix-wrap">
                      <FaPercentage className="field-prefix-icon" />
                      <input
                        type="number"
                        min="0"
                        max="100"
                        className={`field-input field-prefixed ${errors.discount ? "field-err" : ""}`}
                        placeholder="0"
                        value={form.discount}
                        onChange={(e) =>
                          handleChange("discount", e.target.value)
                        }
                      />
                    </div>
                    {errors.discount && (
                      <div className="err-msg">
                        <FaExclamationTriangle size={9} /> {errors.discount}
                      </div>
                    )}
                  </div>
                  <div className="field-block">
                    <div className="field-label-row">
                      <label className="field-label">
                        <FaLayerGroup className="field-label-icon" /> Category
                      </label>
                      <span className="field-req">* required</span>
                    </div>
                    <select
                      className={`field-select ${errors.category ? "field-err" : ""}`}
                      value={form.category}
                      onChange={(e) => handleChange("category", e.target.value)}
                    >
                      <option value="">Select category</option>
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <div className="err-msg">
                        <FaExclamationTriangle size={9} /> {errors.category}
                      </div>
                    )}
                  </div>
                  <div className="field-block">
                    <div className="field-label-row">
                      <label className="field-label">
                        <FaWarehouse className="field-label-icon" /> Stock Qty
                      </label>
                      <span className="field-opt">optional</span>
                    </div>
                    <div className="field-prefix-wrap">
                      <FaWarehouse className="field-prefix-icon" />
                      <input
                        type="number"
                        min="0"
                        className={`field-input field-prefixed ${errors.stock ? "field-err" : ""}`}
                        placeholder="e.g. 100"
                        value={form.stock}
                        onChange={(e) => handleChange("stock", e.target.value)}
                      />
                    </div>
                    {errors.stock && (
                      <div className="err-msg">
                        <FaExclamationTriangle size={9} /> {errors.stock}
                      </div>
                    )}
                  </div>
                  <div className="field-block">
                    <div className="field-label-row">
                      <label className="field-label">
                        <FaStar className="field-label-icon" /> Rating (0-5)
                      </label>
                      <span className="field-opt">optional</span>
                    </div>
                    <div className="field-prefix-wrap">
                      <FaStar
                        className="field-prefix-icon"
                        style={{ color: "#f59e0b" }}
                      />
                      <input
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        className={`field-input field-prefixed ${errors.rating ? "field-err" : ""}`}
                        placeholder="e.g. 4.5"
                        value={form.rating}
                        onChange={(e) => handleChange("rating", e.target.value)}
                      />
                    </div>
                    {errors.rating && (
                      <div className="err-msg">
                        <FaExclamationTriangle size={9} /> {errors.rating}
                      </div>
                    )}
                  </div>
                  <div className="field-block field-full">
                    <div className="field-label-row">
                      <label className="field-label">
                        <FaImage className="field-label-icon" /> Image URL
                      </label>
                      <span className="field-req">* required</span>
                    </div>
                    <div className="field-prefix-wrap">
                      <FaImage className="field-prefix-icon" />
                      <input
                        className={`field-input field-prefixed ${errors.image ? "field-err" : ""}`}
                        placeholder="https://example.com/product.png"
                        value={form.image}
                        onChange={(e) => handleChange("image", e.target.value)}
                      />
                    </div>
                    {errors.image && (
                      <div className="err-msg">
                        <FaExclamationTriangle size={9} /> {errors.image}
                      </div>
                    )}
                  </div>
                  <div className="field-block field-full">
                    <div className="field-label-row">
                      <label className="field-label">
                        <FaAlignLeft className="field-label-icon" /> Description
                      </label>
                      <span className="field-opt">optional</span>
                    </div>
                    <textarea
                      className="field-textarea"
                      placeholder="Product features, specs, details..."
                      value={form.description}
                      onChange={(e) =>
                        handleChange("description", e.target.value)
                      }
                      rows={4}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-preview-area">
                <div className="preview-label">Live Preview</div>
                <div className="preview-img-box">
                  {imgPreview ? (
                    <img
                      src={imgPreview}
                      alt=""
                      onError={() => setImgPreview("")}
                    />
                  ) : (
                    <div className="preview-placeholder">
                      <FaImage />
                      <span>No image</span>
                    </div>
                  )}
                </div>
                <div className="preview-card">
                  <div className="preview-name">
                    {form.title || (
                      <span className="preview-empty">Product name...</span>
                    )}
                  </div>
                  <div className="preview-price-row">
                    {discountedPrice ? (
                      <>
                        <span className="preview-price">
                          ${discountedPrice}
                        </span>
                        <span className="preview-original">
                          ${Number(form.price).toFixed(2)}
                        </span>
                        <span className="preview-disc-badge">
                          -{form.discount}%
                        </span>
                      </>
                    ) : (
                      <span className="preview-price">
                        {form.price ? (
                          `$${Number(form.price).toFixed(2)}`
                        ) : (
                          <span className="preview-empty">$0.00</span>
                        )}
                      </span>
                    )}
                  </div>
                  {renderStars(form.rating)}
                  <div className="preview-cat">
                    {form.category || "No category"}
                  </div>
                  {form.stock !== "" && (
                    <div
                      className="preview-stock"
                      style={{
                        color:
                          Number(form.stock) > 10
                            ? "#10b981"
                            : Number(form.stock) > 0
                              ? "#f59e0b"
                              : "#ef4444",
                      }}
                    >
                      {Number(form.stock) > 10
                        ? "In Stock"
                        : Number(form.stock) > 0
                          ? "Low Stock"
                          : "Out of Stock"}
                      {form.stock ? ` (${form.stock})` : ""}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="modal-footer">
          <div className="modal-footer-hint">
            <FaShieldAlt size={10} /> Fields marked{" "}
            <span style={{ color: "#ef4444", margin: "0 2px" }}>*</span> are
            required
          </div>
          <div className="modal-btn-row">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              form="prod-form"
              className={`btn-submit ${isEdit ? "btn-edit" : "btn-add"}`}
              disabled={saving}
            >
              {saving ? (
                "Saving..."
              ) : (
                <>
                  <FaCheck size={11} />
                  {isEdit ? "Save Changes" : "Add Product"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const INBOX_MESSAGES = [
  {
    id: 1,
    from: "System Monitor",
    avatar: "SM",
    color: "#3b82f6",
    subject: "High CPU Usage Detected",
    body: "CPU usage has exceeded 85% for the last 10 minutes on the production server. Consider scaling up or investigating the spike.",
    time: "2 min ago",
    read: false,
    tag: "alert",
  },
  {
    id: 2,
    from: "Payment Gateway",
    avatar: "PG",
    color: "#ef4444",
    subject: "/api/payments endpoint is down",
    body: "The payment gateway is returning 503 errors. Users are unable to complete purchases. Immediate action required.",
    time: "18 min ago",
    read: false,
    tag: "critical",
  },
  {
    id: 3,
    from: "Inventory Bot",
    avatar: "IB",
    color: "#f59e0b",
    subject: "Low Stock Alert: 3 products",
    body: "iPhone Case (4 left), Wireless Earbuds (2 left), and Leather Wallet (1 left) are running critically low on stock.",
    time: "1 hr ago",
    read: false,
    tag: "warning",
  },
  {
    id: 4,
    from: "Ahmad (You)",
    avatar: "AH",
    color: "#10b981",
    subject: "DB Backup Completed",
    body: "Scheduled database backup completed successfully. All 47 collections backed up. Backup size: 2.4 GB. Stored in /backups/2026-02.",
    time: "6 hr ago",
    read: true,
    tag: "info",
  },
  {
    id: 5,
    from: "Security Module",
    avatar: "SC",
    color: "#a78bfa",
    subject: "New Login Detected",
    body: "A new admin login was detected from IP 192.168.1.1 at 14:32 PKT. If this was not you, change your password immediately.",
    time: "Yesterday",
    read: true,
    tag: "security",
  },
  {
    id: 6,
    from: "Cron Scheduler",
    avatar: "CS",
    color: "#06b6d4",
    subject: "Weekly Report Ready",
    body: "Your weekly analytics report for Feb 16-23 is ready. Revenue: $18,420. New products added: 12. Total orders: 340.",
    time: "2 days ago",
    read: true,
    tag: "report",
  },
];

const tagColors = {
  alert: {
    bg: "rgba(59,130,246,0.12)",
    color: "#3b82f6",
    border: "rgba(59,130,246,0.2)",
  },
  critical: {
    bg: "rgba(239,68,68,0.12)",
    color: "#ef4444",
    border: "rgba(239,68,68,0.2)",
  },
  warning: {
    bg: "rgba(245,158,11,0.12)",
    color: "#f59e0b",
    border: "rgba(245,158,11,0.2)",
  },
  info: {
    bg: "rgba(16,185,129,0.12)",
    color: "#10b981",
    border: "rgba(16,185,129,0.2)",
  },
  security: {
    bg: "rgba(167,139,250,0.12)",
    color: "#a78bfa",
    border: "rgba(167,139,250,0.2)",
  },
  report: {
    bg: "rgba(6,182,212,0.12)",
    color: "#06b6d4",
    border: "rgba(6,182,212,0.2)",
  },
};

const InboxPanel = () => {
  const [messages, setMessages] = useState(INBOX_MESSAGES);
  const [selected, setSelected] = useState(null);
  const [replyText, setReplyText] = useState("");
  const unreadCount = messages.filter((m) => !m.read).length;
  const markRead = (id) =>
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, read: true } : m)),
    );
  const markAllRead = () =>
    setMessages((prev) => prev.map((m) => ({ ...m, read: true })));
  const deleteMsg = (id) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    if (selected?.id === id) setSelected(null);
    toast.success("Message deleted", { autoClose: 1000 });
  };
  const openMsg = (msg) => {
    setSelected(msg);
    markRead(msg.id);
    setReplyText("");
  };
  const sendReply = () => {
    if (!replyText.trim()) return;
    toast.success("Reply sent!", { autoClose: 1500 });
    setReplyText("");
  };

  return (
    <div className="panel-root">
      <div className="panel-header">
        <div>
          <div className="breadcrumb">
            console / <span>inbox</span>
          </div>
          <h1 className="page-title">Inbox</h1>
          <p className="page-sub">
            {unreadCount} unread of {messages.length} messages
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            className="add-btn"
            onClick={markAllRead}
            style={{
              background: "var(--sf3)",
              boxShadow: "none",
              border: "1px solid var(--bd2)",
            }}
          >
            <FaCheckDouble size={11} /> Mark All Read
          </button>
        )}
      </div>
      <div className="inbox-layout">
        <div className="inbox-list">
          {messages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <FaInbox />
              </div>
              <div className="empty-text">inbox is empty</div>
            </div>
          ) : (
            messages.map((msg) => {
              const tc = tagColors[msg.tag];
              return (
                <div
                  key={msg.id}
                  className={`inbox-item ${selected?.id === msg.id ? "inbox-item-active" : ""} ${!msg.read ? "inbox-item-unread" : ""}`}
                  onClick={() => openMsg(msg)}
                >
                  <div
                    className="inbox-avatar"
                    style={{ background: msg.color }}
                  >
                    {msg.avatar}
                  </div>
                  <div className="inbox-item-content">
                    <div className="inbox-item-top">
                      <span className="inbox-from">{msg.from}</span>
                      <span className="inbox-time">{msg.time}</span>
                    </div>
                    <div className="inbox-subject">{msg.subject}</div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginTop: 4,
                      }}
                    >
                      <span
                        className="inbox-tag"
                        style={{
                          background: tc.bg,
                          color: tc.color,
                          border: `1px solid ${tc.border}`,
                        }}
                      >
                        {msg.tag}
                      </span>
                      {!msg.read && <span className="inbox-unread-dot" />}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="inbox-detail">
          {selected ? (
            <>
              <div className="inbox-detail-head">
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <div>
                    <div className="inbox-detail-subject">
                      {selected.subject}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginTop: 8,
                      }}
                    >
                      <div
                        className="inbox-avatar"
                        style={{
                          background: selected.color,
                          width: 28,
                          height: 28,
                          fontSize: 10,
                        }}
                      >
                        {selected.avatar}
                      </div>
                      <span style={{ fontSize: 12, color: "var(--mu2)" }}>
                        From{" "}
                        <strong style={{ color: "var(--tx)" }}>
                          {selected.from}
                        </strong>{" "}
                        {selected.time}
                      </span>
                    </div>
                  </div>
                  <button
                    className="action-btn del"
                    onClick={() => deleteMsg(selected.id)}
                  >
                    <FaTrashAlt size={11} />
                  </button>
                </div>
              </div>
              <div className="inbox-detail-body">
                <p
                  style={{ fontSize: 14, color: "var(--tx)", lineHeight: 1.7 }}
                >
                  {selected.body}
                </p>
              </div>
              <div className="inbox-reply-box">
                <div
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 10,
                    color: "var(--mu)",
                    marginBottom: 8,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  Quick Reply
                </div>
                <textarea
                  className="field-textarea"
                  rows={3}
                  placeholder={`Reply to ${selected.from}...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  style={{ marginBottom: 10 }}
                />
                <button
                  className="btn-submit btn-add"
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={sendReply}
                >
                  <FaReply size={11} /> Send Reply
                </button>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <FaEnvelope />
              </div>
              <div className="empty-text">select a message to read</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DB_COLLECTIONS = [
  { name: "products", docs: 47, size: "1.2 MB", indexes: 3, status: "healthy" },
  { name: "admins", docs: 2, size: "4.1 KB", indexes: 2, status: "healthy" },
  { name: "orders", docs: 340, size: "8.7 MB", indexes: 5, status: "healthy" },
  { name: "users", docs: 1247, size: "15.3 MB", indexes: 4, status: "healthy" },
  { name: "sessions", docs: 89, size: "220 KB", indexes: 1, status: "warning" },
  { name: "logs", docs: 12480, size: "48.6 MB", indexes: 2, status: "healthy" },
];

const DatabasePanel = () => {
  const [pinging, setPinging] = useState(false);
  const [pingResult, setPingResult] = useState(null);

  const handlePing = () => {
    setPinging(true);
    setPingResult(null);
    setTimeout(() => {
      setPinging(false);
      setPingResult("12ms");
      toast.success("Database ping successful!", { autoClose: 1500 });
    }, 1200);
  };

  const handleBackup = () => {
    toast.info("Backup initiated...", { autoClose: 2000 });
    setTimeout(
      () =>
        toast.success("Backup completed! Saved to /backups/", {
          autoClose: 2000,
        }),
      2500,
    );
  };

  const handleFlush = (name) => {
    Swal.fire({
      title: `Flush "${name}"?`,
      text: "This will delete all documents. Cannot be undone.",
      icon: "warning",
      background: "#0d1117",
      color: "#e2e8f0",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#3b82f6",
      confirmButtonText: "Yes, Flush",
    }).then((r) => {
      if (r.isConfirmed)
        toast.error(`Collection "${name}" flushed!`, { autoClose: 1500 });
    });
  };

  return (
    <div className="panel-root">
      <div className="panel-header">
        <div>
          <div className="breadcrumb">
            console / <span>database</span>
          </div>
          <h1 className="page-title">Database</h1>
          <p className="page-sub">MongoDB · nexus-db · 6 collections</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            className="add-btn"
            onClick={handlePing}
            style={{
              background: "var(--sf3)",
              boxShadow: "none",
              border: "1px solid var(--bd2)",
            }}
          >
            <FaWifi size={11} />{" "}
            {pinging
              ? "Pinging..."
              : pingResult
                ? `Ping: ${pingResult}`
                : "Ping DB"}
          </button>
          <button className="add-btn" onClick={handleBackup}>
            <FaHdd size={11} /> Backup Now
          </button>
        </div>
      </div>
      <div className="stats-grid" style={{ marginBottom: 20 }}>
        {[
          {
            label: "Total Documents",
            value: "14,205",
            icon: <FaTable />,
            color: "var(--bl)",
          },
          {
            label: "DB Size",
            value: "74.1 MB",
            icon: <FaHdd />,
            color: "var(--gr)",
          },
          {
            label: "Collections",
            value: "6",
            icon: <FaDatabase />,
            color: "var(--am)",
          },
          {
            label: "Avg Response",
            value: "12ms",
            icon: <FaServer />,
            color: "var(--cy)",
          },
        ].map((s) => (
          <div
            className="stat-card"
            key={s.label}
            style={{ padding: "16px 18px" }}
          >
            <div className="stat-top">
              <div>
                <div className="stat-label">{s.label}</div>
                <div className="stat-value" style={{ fontSize: 22 }}>
                  {s.value}
                </div>
              </div>
              <div style={{ fontSize: 20, color: s.color, opacity: 0.7 }}>
                {s.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="monitor-card" style={{ marginBottom: 16 }}>
        <div className="monitor-title">Connection Info</div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))",
            gap: 12,
          }}
        >
          {[
            { label: "Host", value: "localhost:27017" },
            { label: "Database", value: "nexus-db" },
            { label: "Driver", value: "Mongoose 7.x" },
            { label: "Status", value: "Connected", green: true },
          ].map((row) => (
            <div
              key={row.label}
              style={{
                background: "var(--sf2)",
                border: "1px solid var(--bd)",
                borderRadius: 9,
                padding: "12px 14px",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 9,
                  color: "var(--mu)",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 5,
                }}
              >
                {row.label}
              </div>
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 12,
                  color: row.green ? "var(--gr)" : "var(--tx)",
                  fontWeight: 600,
                }}
              >
                {row.value}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="table-card">
        <div className="table-header">
          <div>
            <div className="table-title">Collections</div>
            <div className="table-meta">All MongoDB collections</div>
          </div>
          <span className="table-badge">6 collections</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>Collection</th>
                <th>Documents</th>
                <th>Size</th>
                <th>Indexes</th>
                <th>Status</th>
                <th style={{ textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {DB_COLLECTIONS.map((col) => (
                <tr key={col.name}>
                  <td>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 9 }}
                    >
                      <FaTable style={{ color: "var(--mu)", fontSize: 12 }} />
                      <span
                        style={{
                          fontFamily: "var(--mono)",
                          fontSize: 13,
                          color: "var(--tx)",
                          fontWeight: 600,
                        }}
                      >
                        {col.name}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: 13,
                        color: "var(--tx)",
                      }}
                    >
                      {col.docs.toLocaleString()}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: 12,
                        color: "var(--mu2)",
                      }}
                    >
                      {col.size}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: 12,
                        color: "var(--mu2)",
                      }}
                    >
                      {col.indexes}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`status-pill ${col.status === "healthy" ? "live" : "draft"}`}
                    >
                      <span className="status-pill-dot" />
                      {col.status}
                    </span>
                  </td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 7,
                      }}
                    >
                      <button
                        className="action-btn del"
                        title="Flush collection"
                        onClick={() => handleFlush(col.name)}
                      >
                        <FaTrashAlt size={10} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const SettingsPanel = ({ adminInfo, setAdminInfo, handleLogout }) => {
  const [activeTab, setActiveTab] = useState("general");
  const [profile, setProfile] = useState({
    name: adminInfo.name,
    email: adminInfo.email,
  });
  const [security, setSecurity] = useState({
    currentPw: "",
    newPw: "",
    confirmPw: "",
  });
  const [notifs, setNotifs] = useState({
    lowStock: true,
    newOrders: true,
    systemAlerts: true,
    weeklyReport: false,
    loginAlerts: true,
  });
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = () => {
    setSaving(true);
    setTimeout(() => {
      setAdminInfo((prev) => ({
        ...prev,
        name: profile.name,
        email: profile.email,
      }));
      toast.success("Profile updated!", { autoClose: 1500 });
      setSaving(false);
    }, 800);
  };

  const handleChangePw = () => {
    if (!security.currentPw || !security.newPw || !security.confirmPw) {
      toast.error("All fields required!");
      return;
    }
    if (security.newPw !== security.confirmPw) {
      toast.error("Passwords don't match!");
      return;
    }
    if (security.newPw.length < 8) {
      toast.error("Password must be at least 8 characters!");
      return;
    }
    setSaving(true);
    setTimeout(() => {
      toast.success("Password changed!", { autoClose: 1500 });
      setSecurity({ currentPw: "", newPw: "", confirmPw: "" });
      setSaving(false);
    }, 900);
  };

  const Toggle = ({ val, onChange }) => (
    <button
      onClick={() => onChange(!val)}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
        fontSize: 22,
        color: val ? "var(--gr)" : "var(--mu)",
        transition: "color 0.2s",
      }}
    >
      {val ? <FaToggleOn /> : <FaToggleOff />}
    </button>
  );

  const tabs = [
    { key: "general", label: "General", icon: <FaCog size={12} /> },
    { key: "security", label: "Security", icon: <FaLock size={12} /> },
    {
      key: "notifications",
      label: "Notifications",
      icon: <FaBell size={12} />,
    },
  ];

  return (
    <div className="panel-root">
      <div className="panel-header">
        <div>
          <div className="breadcrumb">
            console / <span>settings</span>
          </div>
          <h1 className="page-title">Settings</h1>
          <p className="page-sub">Manage your account and preferences</p>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: 4,
          marginBottom: 20,
          background: "var(--sf)",
          border: "1px solid var(--bd)",
          borderRadius: 12,
          padding: 5,
          width: "fit-content",
        }}
      >
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "8px 18px",
              borderRadius: 9,
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--sans)",
              fontSize: 13,
              fontWeight: 600,
              transition: "all 0.18s",
              background: activeTab === t.key ? "var(--bl)" : "transparent",
              color: activeTab === t.key ? "#fff" : "var(--mu2)",
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {activeTab === "general" && (
        <div className="settings-card">
          <div className="settings-section-title">Profile Information</div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
              marginBottom: 16,
            }}
          >
            <div className="field-block">
              <label className="field-label">Display Name</label>
              <input
                className="field-input"
                value={profile.name}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, name: e.target.value }))
                }
              />
            </div>
            <div className="field-block">
              <label className="field-label">Email Address</label>
              <input
                className="field-input"
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, email: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="field-block" style={{ marginBottom: 16 }}>
            <label className="field-label">Role</label>
            <input
              className="field-input"
              value={adminInfo.role}
              disabled
              style={{ opacity: 0.5, cursor: "not-allowed" }}
            />
          </div>
          <button
            className="btn-submit btn-add"
            onClick={handleSaveProfile}
            disabled={saving}
            style={{ width: "fit-content" }}
          >
            {saving ? (
              "Saving..."
            ) : (
              <>
                <FaSave size={11} /> Save Profile
              </>
            )}
          </button>
          <div className="settings-divider" />
          <div className="settings-section-title">Danger Zone</div>
          <div
            style={{
              background: "rgba(239,68,68,0.05)",
              border: "1px solid rgba(239,68,68,0.15)",
              borderRadius: 10,
              padding: "16px 18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div>
              <div
                style={{ fontSize: 13, fontWeight: 600, color: "var(--rd)" }}
              >
                Logout of Admin Console
              </div>
              <div style={{ fontSize: 12, color: "var(--mu2)", marginTop: 3 }}>
                End your current session immediately.
              </div>
            </div>
            <button
              className="btn-submit"
              style={{
                background: "var(--rd)",
                boxShadow: "0 4px 14px rgba(239,68,68,0.3)",
              }}
              onClick={handleLogout}
            >
              <FaSignOutAlt size={11} /> Logout
            </button>
          </div>
        </div>
      )}

      {activeTab === "security" && (
        <div className="settings-card">
          <div className="settings-section-title">Change Password</div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              maxWidth: 400,
              marginBottom: 20,
            }}
          >
            {[
              { label: "Current Password", key: "currentPw" },
              { label: "New Password", key: "newPw" },
              { label: "Confirm New Password", key: "confirmPw" },
            ].map((f) => (
              <div className="field-block" key={f.key}>
                <label className="field-label">
                  <FaKey className="field-label-icon" /> {f.label}
                </label>
                <div className="field-prefix-wrap">
                  <FaLock className="field-prefix-icon" />
                  <input
                    type="password"
                    className="field-input field-prefixed"
                    placeholder="password"
                    value={security[f.key]}
                    onChange={(e) =>
                      setSecurity((s) => ({ ...s, [f.key]: e.target.value }))
                    }
                  />
                </div>
              </div>
            ))}
            <button
              className="btn-submit btn-edit"
              onClick={handleChangePw}
              disabled={saving}
              style={{ width: "fit-content" }}
            >
              {saving ? (
                "Updating..."
              ) : (
                <>
                  <FaLock size={11} /> Update Password
                </>
              )}
            </button>
          </div>
          <div className="settings-divider" />
          <div className="settings-section-title">Active Sessions</div>
          {[
            {
              device: "Chrome on Windows",
              ip: "192.168.1.1",
              time: "Current session",
              current: true,
            },
            {
              device: "Mobile Safari",
              ip: "10.0.0.14",
              time: "2 days ago",
              current: false,
            },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "var(--sf2)",
                border: "1px solid var(--bd)",
                borderRadius: 9,
                padding: "12px 16px",
                marginBottom: 8,
              }}
            >
              <div>
                <div
                  style={{ fontSize: 13, fontWeight: 600, color: "var(--tx)" }}
                >
                  {s.device}
                </div>
                <div
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 11,
                    color: "var(--mu)",
                    marginTop: 3,
                  }}
                >
                  {s.ip} - {s.time}
                </div>
              </div>
              {s.current ? (
                <span className="status-pill live">
                  <span className="status-pill-dot" />
                  Active
                </span>
              ) : (
                <button
                  className="btn-cancel"
                  style={{ padding: "5px 12px", fontSize: 11 }}
                  onClick={() =>
                    toast.success("Session revoked!", { autoClose: 1500 })
                  }
                >
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === "notifications" && (
        <div className="settings-card">
          <div className="settings-section-title">Notification Preferences</div>
          {[
            {
              key: "lowStock",
              label: "Low Stock Alerts",
              desc: "Get notified when a product stock falls below 5 units.",
            },
            {
              key: "newOrders",
              label: "New Order Notifications",
              desc: "Receive alerts for every new order placed on the store.",
            },
            {
              key: "systemAlerts",
              label: "System Alerts",
              desc: "Critical alerts for server issues, downtime, or errors.",
            },
            {
              key: "weeklyReport",
              label: "Weekly Summary Report",
              desc: "Receive a weekly analytics digest every Monday.",
            },
            {
              key: "loginAlerts",
              label: "Login Alerts",
              desc: "Get notified whenever a new admin login is detected.",
            },
          ].map((n) => (
            <div
              key={n.key}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 0",
                borderBottom: "1px solid var(--bd)",
              }}
            >
              <div>
                <div
                  style={{ fontSize: 13, fontWeight: 600, color: "var(--tx)" }}
                >
                  {n.label}
                </div>
                <div
                  style={{ fontSize: 12, color: "var(--mu2)", marginTop: 3 }}
                >
                  {n.desc}
                </div>
              </div>
              <Toggle
                val={notifs[n.key]}
                onChange={(v) => {
                  setNotifs((prev) => ({ ...prev, [n.key]: v }));
                  toast.success(`${n.label} ${v ? "enabled" : "disabled"}`, {
                    autoClose: 1000,
                  });
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const InventoryPanel = ({ products, loading, onEdit, onDelete, onAdd }) => {
  const [search, setSearch] = useState("");
  const filtered = products.filter(
    (p) =>
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div className="panel-root">
      <div className="panel-header">
        <div>
          <div className="breadcrumb">
            console / <span>inventory</span>
          </div>
          <h1 className="page-title">Inventory</h1>
          <p className="page-sub">{products.length} products in catalog</p>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <FaSearch
              style={{
                position: "absolute",
                left: 11,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--mu)",
                fontSize: 12,
              }}
            />
            <input
              className="search-input"
              style={{ paddingLeft: 32, width: 220 }}
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="add-btn" onClick={onAdd}>
            <FaPlus size={11} /> Add Product
          </button>
        </div>
      </div>
      <div className="table-card">
        <div className="table-header">
          <div>
            <div className="table-title">All Products</div>
            <div className="table-meta">Full catalog view</div>
          </div>
          <span className="table-badge">{filtered.length} records</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Rating</th>
                <th>Status</th>
                <th style={{ textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ padding: 56, textAlign: "center" }}>
                    <div className="loading-dots">
                      <span />
                      <span />
                      <span />
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6">
                    <div className="empty-state">
                      <div className="empty-icon">
                        <FaBoxOpen />
                      </div>
                      <div className="empty-text">no products found</div>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((p, i) => (
                  <tr key={p._id}>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                        }}
                      >
                        <div className="product-img-wrap">
                          <img src={p.image} alt="" />
                        </div>
                        <div>
                          <div className="product-name">{p.title}</div>
                          <div className="product-id">
                            #{p._id.slice(-8).toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="category-tag">{p.category}</span>
                    </td>
                    <td>
                      <span className="price-val">${p.price}</span>
                    </td>
                    <td>
                      {p.rating?.rate || p.rating ? (
                        <div className="rating-val">
                          <span style={{ color: "#f59e0b" }}>*</span>
                          {p.rating?.rate ?? p.rating}
                        </div>
                      ) : (
                        <span
                          style={{
                            fontFamily: "var(--mono)",
                            fontSize: 10,
                            color: "var(--mu)",
                          }}
                        >
                          -
                        </span>
                      )}
                    </td>
                    <td>
                      <span
                        className={`status-pill ${i % 4 === 3 ? "draft" : "live"}`}
                      >
                        <span className="status-pill-dot" />
                        {i % 4 === 3 ? "Draft" : "Live"}
                      </span>
                    </td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          gap: 7,
                        }}
                      >
                        <button
                          className="action-btn edit"
                          onClick={() => onEdit(p)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="action-btn del"
                          onClick={() => onDelete(p._id, p.title)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState("insights");
  const [time, setTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [adminInfo, setAdminInfo] = useState({
    name: "Ahmad",
    email: "admin123@gmail.com",
    role: "Master Admin",
    since: "February 2026",
  });
  const profileRef = useRef(null);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchProducts();
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.name)
        setAdminInfo((prev) => ({ ...prev, name: payload.name }));
      if (payload.email)
        setAdminInfo((prev) => ({ ...prev, email: payload.email }));
    } catch (_) {}
  }, [navigate]);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setShowProfileCard(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/admin/products/all",
      );
      setProducts(res.data);
    } catch {
      toast.error("Failed to fetch products!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `http://localhost:8000/api/admin/products/delete/${id}`,
          );
          toast.error("Product deleted!", { autoClose: 1000 });
          fetchProducts();
        } catch {
          toast.error("Cannot delete product!");
        }
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
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        toast.success("Logged out!", { autoClose: 1000 });
        navigate("/login");
      }
    });
  };

  const filtered = products.filter(
    (p) =>
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const sp1 = [40, 55, 38, 70, 62, 80, 75, 90, 85, 95];
  const sp2 = [20, 35, 28, 45, 38, 55, 60, 52, 68, 72];
  const sp3 = [10, 18, 14, 22, 19, 28, 24, 30, 27, 35];
  const sp4 = [30, 45, 52, 48, 60, 55, 72, 68, 80, 85];

  const adminInitials = adminInfo.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #070b12; --sf: #0d1117; --sf2: #111827; --sf3: #1a2235;
      --bd: rgba(255,255,255,0.06); --bd2: rgba(255,255,255,0.10);
      --tx: #e2e8f0; --mu: #4b5a6e; --mu2: #64748b;
      --bl: #3b82f6; --bld: rgba(59,130,246,0.12);
      --gr: #10b981; --grd: rgba(16,185,129,0.12);
      --am: #f59e0b; --amd: rgba(245,158,11,0.12);
      --rd: #ef4444; --rdd: rgba(239,68,68,0.12);
      --cy: #06b6d4;
      --mono: 'JetBrains Mono', monospace;
      --sans: 'Outfit', sans-serif;
      --sidebar-w: 260px;
    }
    body { overflow-x: hidden; }
    .dash-root { display: flex; min-height: 100vh; background: var(--bg); font-family: var(--sans); color: var(--tx); overflow-x: hidden; }
    .sidebar-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 99; }
    @media (max-width: 768px) { .sidebar-overlay.visible { display: block; } }
    .sidebar { position: fixed; inset-y: 0; left: 0; width: var(--sidebar-w); background: var(--sf); border-right: 1px solid var(--bd); display: flex; flex-direction: column; transition: transform 0.3s cubic-bezier(.4,0,.2,1); z-index: 100; overflow: hidden; }
    .sidebar.closed { transform: translateX(-100%); }
    .sidebar-logo { padding: 24px 20px 20px; border-bottom: 1px solid var(--bd); display: flex; align-items: center; gap: 12px; }
    .logo-icon { width: 36px; height: 36px; background: linear-gradient(135deg, var(--bl), #6366f1); border-radius: 10px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px rgba(59,130,246,0.3); flex-shrink: 0; }
    .logo-text { font-family: var(--mono); font-size: 13px; font-weight: 700; color: var(--tx); letter-spacing: 1px; }
    .logo-sub { font-family: var(--mono); font-size: 9px; color: var(--mu); letter-spacing: 2px; text-transform: uppercase; margin-top: 2px; }
    .sys-status { padding: 11px 18px; background: var(--grd); border-bottom: 1px solid var(--bd); display: flex; align-items: center; gap: 8px; }
    .status-dot { width: 7px; height: 7px; background: var(--gr); border-radius: 50%; box-shadow: 0 0 8px var(--gr); animation: blink 2.5s ease infinite; flex-shrink: 0; }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.4} }
    .status-text { font-family: var(--mono); font-size: 10px; color: var(--gr); letter-spacing: 1px; text-transform: uppercase; font-weight: 600; }
    .sidebar-nav { flex: 1; padding: 16px 10px; display: flex; flex-direction: column; gap: 3px; overflow-y: auto; }
    .nav-section-label { font-family: var(--mono); font-size: 9px; color: var(--mu); text-transform: uppercase; letter-spacing: 2px; padding: 10px 12px 6px; font-weight: 600; }
    .nav-btn { display: flex; align-items: center; gap: 12px; width: 100%; padding: 10px 13px; border-radius: 10px; border: none; background: transparent; color: var(--mu2); font-family: var(--sans); font-size: 13.5px; font-weight: 500; cursor: pointer; transition: all 0.18s; text-align: left; }
    .nav-btn:hover { background: var(--sf3); color: var(--tx); }
    .nav-btn.active { background: var(--bld); color: var(--bl); border: 1px solid rgba(59,130,246,0.2); }
    .nav-icon { font-size: 14px; flex-shrink: 0; width: 18px; }
    .nav-badge { margin-left: auto; background: var(--rd); color: #fff; font-size: 10px; font-weight: 700; padding: 1px 7px; border-radius: 100px; font-family: var(--mono); }
    .sidebar-bottom { padding: 14px 10px 18px; border-top: 1px solid var(--bd); display: flex; flex-direction: column; gap: 3px; }
    .main { flex: 1; margin-left: var(--sidebar-w); transition: margin-left 0.3s cubic-bezier(.4,0,.2,1); min-height: 100vh; display: flex; flex-direction: column; }
    .main.expanded { margin-left: 0; }
    @media (max-width: 768px) { .main { margin-left: 0 !important; } }
    .topbar { position: sticky; top: 0; height: 62px; background: rgba(7,11,18,0.88); backdrop-filter: blur(20px); border-bottom: 1px solid var(--bd); display: flex; align-items: center; padding: 0 20px; gap: 12px; z-index: 50; }
    .topbar-toggle { width: 36px; height: 36px; background: var(--sf2); border: 1px solid var(--bd2); border-radius: 9px; display: flex; align-items: center; justify-content: center; color: var(--mu2); cursor: pointer; transition: all 0.18s; flex-shrink: 0; }
    .topbar-toggle:hover { background: var(--sf3); color: var(--tx); }
    .topbar-search { flex: 1; max-width: 340px; position: relative; }
    .search-icon { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: var(--mu); font-size: 12px; pointer-events: none; }
    .search-input { width: 100%; background: var(--sf2); border: 1px solid var(--bd); border-radius: 9px; color: var(--tx); font-family: var(--sans); font-size: 13px; padding: 9px 13px 9px 34px; outline: none; transition: border-color 0.2s; }
    .search-input::placeholder { color: var(--mu); }
    .search-input:focus { border-color: rgba(59,130,246,0.4); }
    .topbar-right { margin-left: auto; display: flex; align-items: center; gap: 10px; }
    .clock { font-family: var(--mono); font-size: 11px; color: var(--mu2); background: var(--sf2); border: 1px solid var(--bd); border-radius: 8px; padding: 5px 11px; letter-spacing: 1px; }
    @media (max-width: 640px) { .clock { display: none; } }
    .topbar-icon-btn { width: 36px; height: 36px; background: var(--sf2); border: 1px solid var(--bd); border-radius: 9px; display: flex; align-items: center; justify-content: center; color: var(--mu2); cursor: pointer; transition: all 0.18s; position: relative; }
    .topbar-icon-btn:hover { background: var(--sf3); color: var(--tx); }
    .notif-dot { position: absolute; top: 7px; right: 7px; width: 6px; height: 6px; background: var(--rd); border-radius: 50%; border: 1.5px solid var(--sf); }
    .profile-wrap { position: relative; }
    .user-chip { display: flex; align-items: center; gap: 9px; background: var(--sf2); border: 1px solid var(--bd2); border-radius: 10px; padding: 5px 13px 5px 7px; cursor: pointer; transition: all 0.18s; user-select: none; }
    .user-chip:hover { background: var(--sf3); border-color: rgba(59,130,246,0.3); }
    .user-chip.active { background: var(--sf3); border-color: rgba(59,130,246,0.4); }
    .avatar { width: 30px; height: 30px; background: linear-gradient(135deg, var(--bl), #6366f1); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-family: var(--mono); font-size: 11px; font-weight: 700; color: #fff; flex-shrink: 0; letter-spacing: 0.5px; }
    .user-info { display: none; }
    @media (min-width: 580px) { .user-info { display: block; } }
    .user-name { font-size: 12px; font-weight: 600; color: var(--tx); line-height: 1; }
    .user-role { font-family: var(--mono); font-size: 9px; color: var(--bl); text-transform: uppercase; letter-spacing: 1px; margin-top: 2px; }
    .profile-card { position: absolute; top: calc(100% + 10px); right: 0; width: 250px; background: var(--sf); border: 1px solid var(--bd2); border-radius: 14px; box-shadow: 0 20px 60px rgba(0,0,0,0.5); z-index: 200; overflow: hidden; animation: cardPop 0.2s cubic-bezier(.4,0,.2,1); }
    @keyframes cardPop { from { opacity: 0; transform: translateY(-6px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
    .pc-header { padding: 20px; background: linear-gradient(135deg, rgba(59,130,246,0.08), rgba(99,102,241,0.06)); border-bottom: 1px solid var(--bd); display: flex; align-items: center; gap: 14px; }
    .pc-avatar { width: 46px; height: 46px; background: linear-gradient(135deg, var(--bl), #6366f1); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-family: var(--mono); font-size: 16px; font-weight: 700; color: #fff; flex-shrink: 0; box-shadow: 0 4px 14px rgba(59,130,246,0.3); }
    .pc-name { font-size: 14px; font-weight: 700; color: var(--tx); }
    .pc-role-badge { display: inline-flex; align-items: center; gap: 5px; background: var(--bld); border: 1px solid rgba(59,130,246,0.2); color: var(--bl); font-family: var(--mono); font-size: 9px; font-weight: 700; padding: 2px 8px; border-radius: 100px; margin-top: 4px; letter-spacing: 0.5px; text-transform: uppercase; }
    .pc-body { padding: 14px 18px; display: flex; flex-direction: column; gap: 10px; }
    .pc-row { display: flex; align-items: center; gap: 10px; }
    .pc-row-icon { width: 28px; height: 28px; background: var(--sf2); border: 1px solid var(--bd); border-radius: 7px; display: flex; align-items: center; justify-content: center; color: var(--mu2); font-size: 11px; flex-shrink: 0; }
    .pc-row-content { display: flex; flex-direction: column; }
    .pc-row-label { font-family: var(--mono); font-size: 9px; color: var(--mu); text-transform: uppercase; letter-spacing: 1px; }
    .pc-row-value { font-size: 12px; color: var(--tx); font-weight: 500; margin-top: 1px; word-break: break-all; }
    .pc-footer { padding: 12px 18px; border-top: 1px solid var(--bd); display: flex; gap: 8px; }
    .pc-btn { flex: 1; padding: 8px; border-radius: 8px; border: 1px solid var(--bd2); background: transparent; color: var(--mu2); font-family: var(--sans); font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; justify-content: center; gap: 6px; }
    .pc-btn:hover { background: var(--sf3); color: var(--tx); }
    .pc-btn.logout-btn { color: var(--rd); border-color: rgba(239,68,68,0.2); }
    .pc-btn.logout-btn:hover { background: var(--rdd); border-color: rgba(239,68,68,0.3); }
    .content { padding: 22px; flex: 1; max-width: 1400px; width: 100%; margin: 0 auto; opacity: 0; transform: translateY(16px); transition: opacity 0.5s, transform 0.5s; }
    .content.mounted { opacity: 1; transform: translateY(0); }
    .panel-root { width: 100%; }
    .panel-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 14px; margin-bottom: 22px; flex-wrap: wrap; }
    .page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 14px; margin-bottom: 22px; flex-wrap: wrap; }
    .breadcrumb { font-family: var(--mono); font-size: 11px; color: var(--mu); letter-spacing: 0.5px; margin-bottom: 5px; }
    .breadcrumb span { color: var(--bl); }
    .page-title { font-family: var(--sans); font-size: 24px; font-weight: 800; color: var(--tx); letter-spacing: -0.5px; line-height: 1.1; }
    .page-sub { font-size: 13px; color: var(--mu2); margin-top: 4px; }
    .add-btn { display: flex; align-items: center; gap: 8px; background: var(--bl); color: #fff; font-family: var(--sans); font-size: 13px; font-weight: 600; padding: 10px 18px; border-radius: 10px; border: none; cursor: pointer; transition: all 0.18s; box-shadow: 0 4px 16px rgba(59,130,246,0.3); white-space: nowrap; flex-shrink: 0; }
    .add-btn:hover { background: #2563eb; transform: translateY(-1px); }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; margin-bottom: 20px; }
    .stat-card { background: var(--sf); border: 1px solid var(--bd); border-radius: 13px; padding: 20px 20px 16px; transition: border-color 0.2s, transform 0.2s; }
    .stat-card:hover { border-color: var(--bd2); transform: translateY(-2px); }
    .stat-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 12px; }
    .stat-label { font-family: var(--mono); font-size: 10px; color: var(--mu); text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600; }
    .stat-value { font-family: var(--sans); font-size: 30px; font-weight: 800; color: var(--tx); line-height: 1; margin-top: 4px; letter-spacing: -1px; }
    .stat-change { font-family: var(--mono); font-size: 11px; font-weight: 600; margin-top: 5px; }
    .stat-change.up { color: var(--gr); } .stat-change.down { color: var(--rd); }
    .stat-bottom { margin-top: 12px; border-top: 1px solid var(--bd); padding-top: 12px; }
    .monitor-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; margin-bottom: 20px; }
    @media (max-width: 1024px) { .monitor-row { grid-template-columns: 1fr 1fr; } }
    @media (max-width: 640px) { .monitor-row { grid-template-columns: 1fr; } }
    .monitor-card, .activity-card { background: var(--sf); border: 1px solid var(--bd); border-radius: 13px; padding: 18px; }
    .monitor-title { font-family: var(--mono); font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: var(--mu); font-weight: 600; margin-bottom: 14px; }
    .monitor-items { display: flex; flex-direction: column; gap: 9px; }
    .monitor-item { display: flex; align-items: center; gap: 10px; }
    .monitor-item-label { font-size: 11px; color: var(--mu2); width: 88px; flex-shrink: 0; font-family: var(--mono); }
    .monitor-bar-wrap { flex: 1; height: 5px; background: rgba(255,255,255,0.05); border-radius: 100px; overflow: hidden; }
    .monitor-bar { height: 100%; border-radius: 100px; }
    .monitor-val { font-family: var(--mono); font-size: 11px; color: var(--tx); width: 34px; text-align: right; flex-shrink: 0; }
    .activity-item { display: flex; align-items: flex-start; gap: 11px; padding: 9px 0; border-bottom: 1px solid var(--bd); }
    .activity-item:last-child { border-bottom: none; padding-bottom: 0; }
    .activity-dot { width: 8px; height: 8px; border-radius: 50%; margin-top: 4px; flex-shrink: 0; }
    .activity-text { font-size: 12px; color: var(--tx); line-height: 1.4; }
    .activity-time { font-family: var(--mono); font-size: 10px; color: var(--mu); margin-top: 2px; }
    .table-card { background: var(--sf); border: 1px solid var(--bd); border-radius: 13px; overflow: hidden; }
    .table-header { padding: 18px 22px; border-bottom: 1px solid var(--bd); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
    .table-title { font-size: 14px; font-weight: 700; color: var(--tx); }
    .table-meta { font-family: var(--mono); font-size: 10px; color: var(--mu); margin-top: 3px; }
    .table-badge { background: var(--bld); border: 1px solid rgba(59,130,246,0.2); color: var(--bl); font-family: var(--mono); font-size: 11px; font-weight: 700; padding: 3px 11px; border-radius: 100px; }
    table { width: 100%; border-collapse: collapse; }
    thead tr { background: rgba(255,255,255,0.02); border-bottom: 1px solid var(--bd); }
    th { padding: 12px 20px; text-align: left; font-family: var(--mono); font-size: 10px; font-weight: 700; color: var(--mu); text-transform: uppercase; letter-spacing: 1.5px; white-space: nowrap; }
    tbody tr { border-bottom: 1px solid var(--bd); transition: background 0.15s; }
    tbody tr:last-child { border-bottom: none; }
    tbody tr:hover { background: rgba(255,255,255,0.02); }
    td { padding: 14px 20px; vertical-align: middle; }
    .product-img-wrap { width: 42px; height: 42px; background: var(--sf2); border: 1px solid var(--bd); border-radius: 9px; display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0; }
    .product-img-wrap img { width: 100%; height: 100%; object-fit: contain; }
    .product-name { font-size: 13px; font-weight: 600; color: var(--tx); max-width: 180px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .product-id { font-family: var(--mono); font-size: 10px; color: var(--mu); margin-top: 2px; }
    .category-tag { display: inline-block; background: var(--sf3); border: 1px solid var(--bd2); color: var(--mu2); font-family: var(--mono); font-size: 10px; font-weight: 600; padding: 3px 9px; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.8px; }
    .price-val { font-family: var(--mono); font-size: 13px; font-weight: 700; color: var(--gr); }
    .rating-val { font-family: var(--mono); font-size: 11px; color: var(--am); display: flex; align-items: center; gap: 3px; }
    .status-pill { display: inline-flex; align-items: center; gap: 5px; font-family: var(--mono); font-size: 10px; font-weight: 600; padding: 3px 9px; border-radius: 100px; letter-spacing: 0.5px; }
    .status-pill.live { background: var(--grd); color: var(--gr); border: 1px solid rgba(16,185,129,0.2); }
    .status-pill.draft { background: var(--amd); color: var(--am); border: 1px solid rgba(245,158,11,0.2); }
    .status-pill-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
    .action-btn { width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--bd); background: var(--sf2); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.15s; font-size: 12px; }
    .action-btn.edit { color: var(--bl); } .action-btn.edit:hover { background: var(--bld); border-color: rgba(59,130,246,0.3); }
    .action-btn.del { color: var(--rd); } .action-btn.del:hover { background: var(--rdd); border-color: rgba(239,68,68,0.3); }
    .empty-state { padding: 56px 20px; text-align: center; }
    .empty-icon { font-size: 32px; color: var(--mu); margin-bottom: 10px; }
    .empty-text { font-size: 13px; color: var(--mu2); font-family: var(--mono); }
    .loading-dots { display: inline-flex; gap: 6px; }
    .loading-dots span { width: 7px; height: 7px; background: var(--bl); border-radius: 50%; animation: bounce 1.2s ease infinite; }
    .loading-dots span:nth-child(2) { animation-delay: 0.2s; } .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes bounce { 0%,80%,100%{ transform: scale(0.6); opacity: 0.4; } 40%{ transform: scale(1); opacity: 1; } }
    @media (max-width: 640px) { .hide-mobile { display: none; } td, th { padding: 12px 12px; } }
    .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.78); backdrop-filter: blur(8px); z-index: 500; display: flex; align-items: center; justify-content: center; padding: 16px; animation: fadein 0.2s ease; }
    @keyframes fadein { from{opacity:0} to{opacity:1} }
    .modal-box { background: #0d1117; border: 1px solid rgba(255,255,255,0.09); border-radius: 18px; width: 100%; max-width: 760px; max-height: 94vh; overflow: hidden; display: flex; flex-direction: column; animation: slideup 0.28s cubic-bezier(.4,0,.2,1); box-shadow: 0 40px 100px rgba(0,0,0,0.7); }
    @keyframes slideup { from{opacity:0;transform:translateY(28px) scale(0.96)} to{opacity:1;transform:translateY(0) scale(1)} }
    .modal-head { padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
    .modal-head-left { display: flex; align-items: center; gap: 13px; }
    .modal-icon { width: 40px; height: 40px; border-radius: 11px; display: flex; align-items: center; justify-content: center; font-size: 15px; flex-shrink: 0; }
    .modal-title { font-family: var(--sans); font-size: 16px; font-weight: 700; color: var(--tx); letter-spacing: -0.2px; }
    .modal-sub { font-family: var(--mono); font-size: 10px; color: var(--mu); text-transform: uppercase; letter-spacing: 1.5px; margin-top: 2px; }
    .modal-close-btn { width: 32px; height: 32px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #64748b; cursor: pointer; transition: all 0.15s; flex-shrink: 0; }
    .modal-close-btn:hover { background: var(--rdd); color: var(--rd); border-color: rgba(239,68,68,0.25); }
    .modal-body { overflow-y: auto; flex: 1; }
    .modal-body::-webkit-scrollbar { width: 4px; } .modal-body::-webkit-scrollbar-thumb { background: #1a2235; border-radius: 100px; }
    .modal-layout { display: grid; grid-template-columns: 1fr 220px; }
    @media (max-width: 600px) { .modal-layout { grid-template-columns: 1fr; } }
    .modal-form-area { padding: 20px 24px; border-right: 1px solid rgba(255,255,255,0.06); }
    @media (max-width: 600px) { .modal-form-area { border-right: none; border-bottom: 1px solid rgba(255,255,255,0.06); } }
    .fields-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 13px; }
    @media (max-width: 480px) { .fields-grid { grid-template-columns: 1fr; } }
    .field-block { display: flex; flex-direction: column; gap: 6px; }
    .field-full { grid-column: 1 / -1; }
    .field-label-row { display: flex; align-items: center; justify-content: space-between; }
    .field-label { font-family: var(--mono); font-size: 10px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 1.2px; display: flex; align-items: center; gap: 5px; }
    .field-label-icon { font-size: 9px; opacity: 0.7; }
    .field-req { font-family: var(--mono); font-size: 9px; color: var(--rd); opacity: 0.8; }
    .field-opt { font-family: var(--mono); font-size: 9px; color: var(--mu); }
    .field-input, .field-select, .field-textarea { background: #111827; border: 1px solid rgba(255,255,255,0.07); border-radius: 9px; color: var(--tx); font-family: var(--sans); font-size: 13px; padding: 10px 12px; outline: none; transition: border-color 0.2s, box-shadow 0.2s, background 0.2s; width: 100%; }
    .field-input::placeholder, .field-textarea::placeholder { color: #2d3748; }
    .field-input:focus, .field-select:focus, .field-textarea:focus { border-color: rgba(59,130,246,0.5); box-shadow: 0 0 0 3px rgba(59,130,246,0.08); background: #0d1117; }
    .field-err { border-color: rgba(239,68,68,0.5) !important; box-shadow: 0 0 0 3px rgba(239,68,68,0.06) !important; }
    .field-select { appearance: none; cursor: pointer; } .field-select option { background: #0d1117; }
    .field-textarea { resize: vertical; min-height: 78px; line-height: 1.5; }
    .field-prefix-wrap { position: relative; }
    .field-prefix-icon { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: var(--mu); font-size: 11px; pointer-events: none; }
    .field-prefixed { padding-left: 30px; }
    .err-msg { font-family: var(--mono); font-size: 10px; color: var(--rd); display: flex; align-items: center; gap: 4px; }
    .modal-preview-area { padding: 20px 16px; display: flex; flex-direction: column; gap: 13px; }
    .preview-label { font-family: var(--mono); font-size: 9px; color: var(--mu); text-transform: uppercase; letter-spacing: 2px; font-weight: 600; margin-bottom: 6px; }
    .preview-img-box { width: 100%; aspect-ratio: 1; background: #111827; border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
    .preview-img-box img { width: 100%; height: 100%; object-fit: contain; padding: 10px; }
    .preview-placeholder { display: flex; flex-direction: column; align-items: center; gap: 7px; color: #1e293b; font-size: 24px; }
    .preview-placeholder span { font-family: var(--mono); font-size: 9px; color: #1e293b; text-transform: uppercase; letter-spacing: 1px; }
    .preview-card { background: #111827; border: 1px solid rgba(255,255,255,0.06); border-radius: 11px; padding: 13px; }
    .preview-name { font-family: var(--sans); font-size: 13px; font-weight: 600; color: var(--tx); margin-bottom: 7px; line-height: 1.3; min-height: 18px; }
    .preview-empty { color: #1e293b; }
    .preview-price-row { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; }
    .preview-price { font-family: var(--mono); font-size: 15px; font-weight: 700; color: var(--gr); }
    .preview-original { font-family: var(--mono); font-size: 11px; color: var(--mu); text-decoration: line-through; }
    .preview-disc-badge { font-family: var(--mono); font-size: 9px; font-weight: 700; background: var(--rdd); color: var(--rd); border: 1px solid rgba(239,68,68,0.2); padding: 2px 7px; border-radius: 100px; }
    .preview-cat { margin-top: 7px; font-family: var(--mono); font-size: 9px; color: var(--mu); text-transform: uppercase; letter-spacing: 1px; border-top: 1px solid rgba(255,255,255,0.04); padding-top: 7px; }
    .preview-stock { margin-top: 5px; font-family: var(--mono); font-size: 9px; font-weight: 600; }
    .modal-footer { padding: 16px 24px; border-top: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-shrink: 0; flex-wrap: wrap; }
    .modal-footer-hint { font-family: var(--mono); font-size: 10px; color: var(--mu); display: flex; align-items: center; gap: 5px; }
    .modal-btn-row { display: flex; gap: 9px; }
    .btn-cancel { background: transparent; border: 1px solid rgba(255,255,255,0.08); border-radius: 9px; color: #64748b; font-family: var(--sans); font-size: 13px; font-weight: 600; padding: 9px 18px; cursor: pointer; transition: all 0.15s; }
    .btn-cancel:hover { background: rgba(255,255,255,0.04); color: var(--tx); }
    .btn-submit { border: none; border-radius: 9px; color: #fff; font-family: var(--sans); font-size: 13px; font-weight: 700; padding: 9px 22px; cursor: pointer; transition: all 0.18s; display: flex; align-items: center; gap: 7px; }
    .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-add { background: linear-gradient(135deg, #3b82f6, #6366f1); box-shadow: 0 4px 14px rgba(59,130,246,0.3); }
    .btn-edit { background: linear-gradient(135deg, #10b981, #059669); box-shadow: 0 4px 14px rgba(16,185,129,0.25); }
    .btn-submit:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-1px); }
    .inbox-layout { display: grid; grid-template-columns: 300px 1fr; gap: 14px; min-height: 500px; }
    @media (max-width: 768px) { .inbox-layout { grid-template-columns: 1fr; } }
    .inbox-list { background: var(--sf); border: 1px solid var(--bd); border-radius: 13px; overflow-y: auto; max-height: 680px; }
    .inbox-item { display: flex; gap: 12px; padding: 14px 16px; cursor: pointer; border-bottom: 1px solid var(--bd); transition: background 0.15s; }
    .inbox-item:last-child { border-bottom: none; }
    .inbox-item:hover { background: var(--sf2); }
    .inbox-item-active { background: var(--bld) !important; border-left: 3px solid var(--bl); }
    .inbox-item-unread { background: rgba(59,130,246,0.03); }
    .inbox-avatar { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-family: var(--mono); font-size: 11px; font-weight: 700; color: #fff; flex-shrink: 0; }
    .inbox-item-content { flex: 1; min-width: 0; }
    .inbox-item-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
    .inbox-from { font-size: 12px; font-weight: 700; color: var(--tx); }
    .inbox-time { font-family: var(--mono); font-size: 9px; color: var(--mu); }
    .inbox-subject { font-size: 12px; color: var(--mu2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .inbox-tag { font-family: var(--mono); font-size: 9px; font-weight: 700; padding: 2px 7px; border-radius: 100px; text-transform: uppercase; letter-spacing: 0.5px; }
    .inbox-unread-dot { width: 7px; height: 7px; background: var(--bl); border-radius: 50%; flex-shrink: 0; }
    .inbox-detail { background: var(--sf); border: 1px solid var(--bd); border-radius: 13px; display: flex; flex-direction: column; }
    .inbox-detail-head { padding: 20px 22px; border-bottom: 1px solid var(--bd); }
    .inbox-detail-subject { font-size: 16px; font-weight: 700; color: var(--tx); line-height: 1.3; }
    .inbox-detail-body { padding: 20px 22px; flex: 1; }
    .inbox-reply-box { padding: 16px 22px; border-top: 1px solid var(--bd); }
    .settings-card { background: var(--sf); border: 1px solid var(--bd); border-radius: 13px; padding: 24px; }
    .settings-section-title { font-family: var(--mono); font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: var(--mu); font-weight: 600; margin-bottom: 16px; }
    .settings-divider { border: none; border-top: 1px solid var(--bd); margin: 24px 0; }
    ::-webkit-scrollbar { width: 5px; height: 5px; }
    ::-webkit-scrollbar-thumb { background: var(--sf3); border-radius: 100px; }
  `;

  return (
    <>
      <style>{CSS}</style>
      <div className="dash-root">
        {showAddModal && (
          <ProductModal
            mode="add"
            initialData={null}
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

        <div
          className={`sidebar-overlay ${isSidebarOpen ? "visible" : ""}`}
          onClick={() => setIsSidebarOpen(false)}
        />

        <aside className={`sidebar ${isSidebarOpen ? "" : "closed"}`}>
          <div className="sidebar-logo">
            <div className="logo-icon">
              <FaShieldAlt color="#fff" size={15} />
            </div>
            <div>
              <div className="logo-text">NEXUS.OS</div>
              <div className="logo-sub">Admin Console</div>
            </div>
          </div>
          <div className="sys-status">
            <div className="status-dot" />
            <span className="status-text">All Systems Nominal</span>
          </div>
          <nav className="sidebar-nav">
            <div className="nav-section-label">Overview</div>
            {[
              { key: "insights", icon: <FaChartLine />, label: "Monitoring" },
              { key: "inventory", icon: <FaBoxOpen />, label: "Inventory" },
              { key: "inbox", icon: <FaInbox />, label: "Inbox", badge: 3 },
            ].map((n) => (
              <button
                key={n.key}
                className={`nav-btn ${activeNav === n.key ? "active" : ""}`}
                onClick={() => setActiveNav(n.key)}
              >
                <span className="nav-icon">{n.icon}</span> {n.label}
                {n.badge ? <span className="nav-badge">{n.badge}</span> : null}
              </button>
            ))}
            <div className="nav-section-label" style={{ marginTop: 6 }}>
              Management
            </div>
            <button
              className="nav-btn"
              onClick={() => {
                toast.info("Directing to Store...", {
                  autoClose: 1000,
                  icon: "🛒",
                });
                setTimeout(() => navigate("/store"), 800);
              }}
            >
              <span className="nav-icon">
                <FaStore />
              </span>{" "}
              View Store
            </button>
            {[
              { key: "database", icon: <FaDatabase />, label: "Database" },
              { key: "settings", icon: <FaCog />, label: "Settings" },
            ].map((n) => (
              <button
                key={n.key}
                className={`nav-btn ${activeNav === n.key ? "active" : ""}`}
                onClick={() => setActiveNav(n.key)}
              >
                <span className="nav-icon">{n.icon}</span> {n.label}
              </button>
            ))}
          </nav>
          <div className="sidebar-bottom">
            <button
              className="nav-btn"
              onClick={handleLogout}
              style={{ color: "var(--rd)" }}
            >
              <FaSignOutAlt className="nav-icon" /> Logout
            </button>
          </div>
        </aside>

        <main className={`main ${isSidebarOpen ? "" : "expanded"}`}>
          <header className="topbar">
            <button
              className="topbar-toggle"
              onClick={() => setIsSidebarOpen((v) => !v)}
            >
              {isSidebarOpen ? <FaTimes size={13} /> : <FaBars size={13} />}
            </button>
            <div className="topbar-search">
              <FaSearch className="search-icon" />
              <input
                className="search-input"
                placeholder="Search products, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="topbar-right">
              <div className="clock">
                {time.toLocaleTimeString("en-US", { hour12: false })}
              </div>
              <div
                className="topbar-icon-btn"
                onClick={() => setActiveNav("inbox")}
              >
                <FaBell size={12} />
                <div className="notif-dot" />
              </div>
              <div
                className="topbar-icon-btn"
                onClick={() => setActiveNav("settings")}
              >
                <FaCog size={12} />
              </div>
              <div className="profile-wrap" ref={profileRef}>
                <div
                  className={`user-chip ${showProfileCard ? "active" : ""}`}
                  onClick={() => setShowProfileCard((v) => !v)}
                >
                  <div className="avatar">{adminInitials}</div>
                  <div className="user-info">
                    <div className="user-name">{adminInfo.name}</div>
                    <div className="user-role">Master Admin</div>
                  </div>
                </div>
                {showProfileCard && (
                  <div className="profile-card">
                    <div className="pc-header">
                      <div className="pc-avatar">{adminInitials}</div>
                      <div>
                        <div className="pc-name">{adminInfo.name}</div>
                        <div className="pc-role-badge">
                          <FaUserShield size={8} /> {adminInfo.role}
                        </div>
                      </div>
                    </div>
                    <div className="pc-body">
                      <div className="pc-row">
                        <div className="pc-row-icon">
                          <FaEnvelope />
                        </div>
                        <div className="pc-row-content">
                          <div className="pc-row-label">Email</div>
                          <div className="pc-row-value">{adminInfo.email}</div>
                        </div>
                      </div>
                      <div className="pc-row">
                        <div className="pc-row-icon">
                          <FaUserShield />
                        </div>
                        <div className="pc-row-content">
                          <div className="pc-row-label">Access Level</div>
                          <div className="pc-row-value">Full Admin Access</div>
                        </div>
                      </div>
                      <div className="pc-row">
                        <div className="pc-row-icon">
                          <FaSignInAlt />
                        </div>
                        <div className="pc-row-content">
                          <div className="pc-row-label">Member Since</div>
                          <div className="pc-row-value">{adminInfo.since}</div>
                        </div>
                      </div>
                    </div>
                    <div className="pc-footer">
                      <button
                        className="pc-btn"
                        onClick={() => {
                          setActiveNav("settings");
                          setShowProfileCard(false);
                        }}
                      >
                        <FaCog size={10} /> Settings
                      </button>
                      <button
                        className="pc-btn logout-btn"
                        onClick={handleLogout}
                      >
                        <FaSignOutAlt size={10} /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          <div className={`content ${mounted ? "mounted" : ""}`}>
            {activeNav === "insights" && (
              <>
                <div className="page-header">
                  <div>
                    <div className="breadcrumb">
                      console / <span>monitoring</span>
                    </div>
                    <h1 className="page-title">System Overview</h1>
                    <p className="page-sub">
                      Real-time monitoring {products.length} products tracked
                    </p>
                  </div>
                  <button
                    className="add-btn"
                    onClick={() => setShowAddModal(true)}
                  >
                    <FaPlus size={11} /> Add Product
                  </button>
                </div>
                <div className="stats-grid">
                  {[
                    {
                      label: "Live Products",
                      value: loading ? "-" : products.length,
                      change: "12.4% this week",
                      up: true,
                      pct: 84,
                      color: "var(--bl)",
                      spark: sp1,
                    },
                    {
                      label: "Gross Revenue",
                      value: "$128.5k",
                      change: "8.1% this month",
                      up: true,
                      pct: 67,
                      color: "var(--gr)",
                      spark: sp2,
                    },
                    {
                      label: "Low Stock Alerts",
                      value: "03",
                      change: "Needs restock",
                      up: false,
                      pct: 23,
                      color: "var(--am)",
                      spark: sp3,
                    },
                    {
                      label: "Active Users",
                      value: "1,247",
                      change: "42 online now",
                      up: true,
                      pct: 91,
                      color: "var(--cy)",
                      spark: sp4,
                    },
                  ].map((s) => (
                    <div className="stat-card" key={s.label}>
                      <div className="stat-top">
                        <div>
                          <div className="stat-label">{s.label}</div>
                          <div className="stat-value">{s.value}</div>
                          <div
                            className={`stat-change ${s.up ? "up" : "down"}`}
                          >
                            {s.up ? "up" : "down"} {s.change}
                          </div>
                        </div>
                        <Donut pct={s.pct} color={s.color} />
                      </div>
                      <div className="stat-bottom">
                        <Sparkline data={s.spark} color={s.color} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="monitor-row">
                  <div className="monitor-card">
                    <div className="monitor-title">System Health</div>
                    <div className="monitor-items">
                      {[
                        {
                          label: "CPU Usage",
                          val: "34%",
                          pct: 34,
                          color: "var(--bl)",
                        },
                        {
                          label: "Memory",
                          val: "61%",
                          pct: 61,
                          color: "var(--gr)",
                        },
                        {
                          label: "Disk I/O",
                          val: "22%",
                          pct: 22,
                          color: "var(--am)",
                        },
                        {
                          label: "Network",
                          val: "78%",
                          pct: 78,
                          color: "var(--cy)",
                        },
                        {
                          label: "API Latency",
                          val: "12ms",
                          pct: 12,
                          color: "#a78bfa",
                        },
                      ].map((item) => (
                        <div className="monitor-item" key={item.label}>
                          <span className="monitor-item-label">
                            {item.label}
                          </span>
                          <div className="monitor-bar-wrap">
                            <div
                              className="monitor-bar"
                              style={{
                                width: `${item.pct}%`,
                                background: item.color,
                              }}
                            />
                          </div>
                          <span className="monitor-val">{item.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="monitor-card">
                    <div className="monitor-title">Endpoint Status</div>
                    {[
                      { label: "/api/products", status: "200 OK", ok: true },
                      { label: "/api/admins", status: "200 OK", ok: true },
                      { label: "/api/orders", status: "200 OK", ok: true },
                      { label: "/api/payments", status: "503 Down", ok: false },
                      { label: "/api/analytics", status: "200 OK", ok: true },
                    ].map((ep) => (
                      <div
                        key={ep.label}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "8px 0",
                          borderBottom: "1px solid var(--bd)",
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "var(--mono)",
                            fontSize: 11,
                            color: "var(--mu2)",
                          }}
                        >
                          {ep.label}
                        </span>
                        <span
                          style={{
                            fontFamily: "var(--mono)",
                            fontSize: 10,
                            fontWeight: 700,
                            color: ep.ok ? "var(--gr)" : "var(--rd)",
                            background: ep.ok ? "var(--grd)" : "var(--rdd)",
                            border: `1px solid ${ep.ok ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`,
                            padding: "3px 9px",
                            borderRadius: 100,
                          }}
                        >
                          {ep.status}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="activity-card">
                    <div className="monitor-title">Recent Activity</div>
                    {[
                      {
                        text: "New product added: Nike Air Max",
                        time: "2 min ago",
                        color: "var(--bl)",
                      },
                      {
                        text: "Admin login from 192.168.1.1",
                        time: "14 min ago",
                        color: "var(--gr)",
                      },
                      {
                        text: "Product #A4F2 deleted by admin",
                        time: "1 hr ago",
                        color: "var(--rd)",
                      },
                      {
                        text: "Stock alert: iPhone Case low",
                        time: "3 hr ago",
                        color: "var(--am)",
                      },
                      {
                        text: "DB backup completed successfully",
                        time: "6 hr ago",
                        color: "var(--cy)",
                      },
                    ].map((act, i) => (
                      <div className="activity-item" key={i}>
                        <div
                          className="activity-dot"
                          style={{ background: act.color }}
                        />
                        <div>
                          <div className="activity-text">{act.text}</div>
                          <div className="activity-time">{act.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="table-card">
                  <div className="table-header">
                    <div>
                      <div className="table-title">Product Catalog</div>
                      <div className="table-meta">
                        Last synced:{" "}
                        {time.toLocaleTimeString("en-US", { hour12: false })}
                      </div>
                    </div>
                    <span className="table-badge">
                      {filtered.length} records
                    </span>
                  </div>
                  <div style={{ overflowX: "auto" }}>
                    <table>
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th className="hide-mobile">Category</th>
                          <th>Price</th>
                          <th className="hide-mobile">Rating</th>
                          <th className="hide-mobile">Status</th>
                          <th style={{ textAlign: "center" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <td
                              colSpan="6"
                              style={{ padding: 56, textAlign: "center" }}
                            >
                              <div className="loading-dots">
                                <span />
                                <span />
                                <span />
                              </div>
                            </td>
                          </tr>
                        ) : filtered.length === 0 ? (
                          <tr>
                            <td colSpan="6">
                              <div className="empty-state">
                                <div className="empty-icon">
                                  <FaBoxOpen />
                                </div>
                                <div className="empty-text">
                                  no products found
                                </div>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          filtered.map((p, i) => (
                            <tr key={p._id}>
                              <td>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                  }}
                                >
                                  <div className="product-img-wrap">
                                    <img src={p.image} alt="" />
                                  </div>
                                  <div>
                                    <div className="product-name">
                                      {p.title}
                                    </div>
                                    <div className="product-id">
                                      #{p._id.slice(-8).toUpperCase()}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="hide-mobile">
                                <span className="category-tag">
                                  {p.category}
                                </span>
                              </td>
                              <td>
                                <span className="price-val">${p.price}</span>
                              </td>
                              <td className="hide-mobile">
                                {p.rating?.rate || p.rating ? (
                                  <div className="rating-val">
                                    <span style={{ color: "#f59e0b" }}>*</span>
                                    {p.rating?.rate ?? p.rating}
                                  </div>
                                ) : (
                                  <span
                                    style={{
                                      fontFamily: "var(--mono)",
                                      fontSize: 10,
                                      color: "var(--mu)",
                                    }}
                                  >
                                    -
                                  </span>
                                )}
                              </td>
                              <td className="hide-mobile">
                                <span
                                  className={`status-pill ${i % 4 === 3 ? "draft" : "live"}`}
                                >
                                  <span className="status-pill-dot" />
                                  {i % 4 === 3 ? "Draft" : "Live"}
                                </span>
                              </td>
                              <td>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    gap: 7,
                                  }}
                                >
                                  <button
                                    className="action-btn edit"
                                    onClick={() => setEditProduct(p)}
                                  >
                                    <FaEdit />
                                  </button>
                                  <button
                                    className="action-btn del"
                                    onClick={() => handleDelete(p._id, p.title)}
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {activeNav === "inventory" && (
              <InventoryPanel
                products={products}
                loading={loading}
                onEdit={(p) => setEditProduct(p)}
                onDelete={handleDelete}
                onAdd={() => setShowAddModal(true)}
              />
            )}

            {activeNav === "inbox" && <InboxPanel />}
            {activeNav === "database" && <DatabasePanel />}
            {activeNav === "settings" && (
              <SettingsPanel
                adminInfo={adminInfo}
                setAdminInfo={setAdminInfo}
                handleLogout={handleLogout}
              />
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;
