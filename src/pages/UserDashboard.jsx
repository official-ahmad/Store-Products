import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSignOutAlt, FaArrowUp, FaArrowDown, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

const API_USERS = "http://localhost:8000/api/users";
const API_CHECKOUT = "http://localhost:8000/api/checkout";

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
});

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState("wallet");
  const [loading, setLoading] = useState(true);
  const [addMoneyAmount, setAddMoneyAmount] = useState("");
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      navigate("/user-login");
      return;
    }

    fetchUserData();
  }, [navigate]);

  const fetchUserData = async () => {
    try {
      const [profileRes, ordersRes, transactionsRes, cartRes] =
        await Promise.all([
          axios.get(`${API_USERS}/profile`, authHeader()),
          axios.get(`${API_CHECKOUT}/my-orders`, authHeader()),
          axios.get(`${API_CHECKOUT}/transaction-history`, authHeader()),
          axios.get(`${API_USERS}/cart`, authHeader()),
        ]);

      setUser(profileRes.data);
      setOrders(ordersRes.data);
      setTransactions(transactionsRes.data);
      setCart(cartRes.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load dashboard");
      if (err.response?.status === 401) {
        localStorage.removeItem("userToken");
        navigate("/user-login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddMoney = async () => {
    if (!addMoneyAmount || addMoneyAmount <= 0) {
      toast.error("Enter valid amount");
      return;
    }

    try {
      const response = await axios.post(
        `${API_CHECKOUT}/add-wallet`,
        { amount: Number(addMoneyAmount) },
        authHeader(),
      );

      setUser({ ...user, walletBalance: response.data.newBalance });
      setAddMoneyAmount("");
      setShowAddMoneyModal(false);
      toast.success("Wallet updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding money");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/");
    toast.info("Logged out successfully");
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <div style={{ fontSize: "24px", color: "#3b82f6" }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={styles.root}>
      <style>{CSS}</style>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>My Dashboard</h1>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      <div style={styles.container}>
        {/* Sidebar - User Info & Wallet */}
        <aside style={styles.sidebar}>
          <div style={styles.userCard}>
            <div style={styles.avatar}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <h3 style={styles.userName}>{user?.name}</h3>
            <p style={styles.userEmail}>{user?.email}</p>
          </div>

          {/* Wallet */}
          <div style={styles.walletCard}>
            <div style={styles.walletLabel}>Wallet Balance</div>
            <div style={styles.walletAmount}>
              ₹ {user?.walletBalance?.toFixed(2)}
            </div>
            <button
              style={styles.addMoneyBtn}
              onClick={() => setShowAddMoneyModal(true)}
            >
              + Add Money
            </button>
          </div>

          {/* Navigation */}
          <nav style={styles.nav}>
            <button
              style={{
                ...styles.navBtn,
                ...(activeTab === "wallet" ? styles.navBtnActive : {}),
              }}
              onClick={() => setActiveTab("wallet")}
            >
              💳 Wallet
            </button>
            <button
              style={{
                ...styles.navBtn,
                ...(activeTab === "orders" ? styles.navBtnActive : {}),
              }}
              onClick={() => setActiveTab("orders")}
            >
              📦 My Orders ({orders.length})
            </button>
            <button
              style={{
                ...styles.navBtn,
                ...(activeTab === "transactions" ? styles.navBtnActive : {}),
              }}
              onClick={() => setActiveTab("transactions")}
            >
              📊 Transactions
            </button>
            <button
              style={{
                ...styles.navBtn,
                ...(activeTab === "cart" ? styles.navBtnActive : {}),
              }}
              onClick={() => setActiveTab("cart")}
            >
              🛒 My Cart ({cart.length})
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main style={styles.content}>
          {/* Wallet Tab */}
          {activeTab === "wallet" && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Wallet Overview</h2>
              <div style={styles.statsGrid}>
                <div style={styles.statBox}>
                  <div style={styles.statLabel}>Current Balance</div>
                  <div style={styles.statValue}>
                    ₹ {user?.walletBalance?.toFixed(2)}
                  </div>
                </div>
                <div style={styles.statBox}>
                  <div style={styles.statLabel}>Total Spent</div>
                  <div style={styles.statValue}>
                    ₹ {user?.totalSpent?.toFixed(2)}
                  </div>
                </div>
                <div style={styles.statBox}>
                  <div style={styles.statLabel}>Total Orders</div>
                  <div style={styles.statValue}>{orders.length}</div>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>My Orders</h2>
              {orders.length === 0 ? (
                <div style={styles.emptyState}>No orders yet</div>
              ) : (
                <div style={styles.ordersList}>
                  {orders.map((order) => (
                    <div key={order._id} style={styles.orderCard}>
                      <div style={styles.orderHeader}>
                        <div>
                          <div style={styles.orderNumber}>
                            {order.orderNumber}
                          </div>
                          <div style={styles.orderDate}>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div style={styles.orderStatus}>{order.status}</div>
                        <div style={styles.orderAmount}>
                          ₹ {order.totalAmount}
                        </div>
                      </div>
                      <div style={styles.orderItems}>
                        {order.items.map((item, i) => (
                          <span key={i} style={styles.itemTag}>
                            {item.title} x{item.quantity}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Transactions Tab */}
          {activeTab === "transactions" && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Transaction History</h2>
              {transactions.length === 0 ? (
                <div style={styles.emptyState}>No transactions yet</div>
              ) : (
                <div style={styles.transactionsList}>
                  {transactions.map((tx) => (
                    <div key={tx._id} style={styles.transactionRow}>
                      <div style={styles.txLeft}>
                        <div style={styles.txIcon}>
                          {tx.type === "credit" ? (
                            <FaArrowDown style={{ color: "#10b981" }} />
                          ) : (
                            <FaArrowUp style={{ color: "#ef4444" }} />
                          )}
                        </div>
                        <div>
                          <div style={styles.txDesc}>{tx.description}</div>
                          <div style={styles.txDate}>
                            {new Date(tx.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          ...styles.txAmount,
                          color: tx.type === "credit" ? "#10b981" : "#ef4444",
                        }}
                      >
                        {tx.type === "credit" ? "+" : "-"}₹ {tx.amount}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Cart Tab */}
          {activeTab === "cart" && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>My Cart</h2>
              {cart.length === 0 ? (
                <div style={styles.emptyState}>Cart is empty</div>
              ) : (
                <div>
                  <div style={styles.cartList}>
                    {cart.map((item) => (
                      <div key={item.productId} style={styles.cartItem}>
                        <img
                          src={item.image}
                          alt={item.title}
                          style={styles.cartImage}
                        />
                        <div style={styles.cartInfo}>
                          <div style={styles.cartTitle}>{item.title}</div>
                          <div style={styles.cartPrice}>
                            ₹ {item.price} x {item.quantity}
                          </div>
                        </div>
                        <div style={styles.cartTotal}>
                          ₹ {(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={styles.checkoutInfo}>
                    <div style={styles.totalRow}>
                      <span>Total Amount:</span>
                      <span style={styles.totalAmount}>
                        ₹{" "}
                        {cart
                          .reduce(
                            (sum, item) => sum + item.price * item.quantity,
                            0,
                          )
                          .toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Add Money Modal */}
      {showAddMoneyModal && (
        <div style={styles.modal} onClick={() => setShowAddMoneyModal(false)}>
          <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3>Add Money to Wallet</h3>
              <button
                style={styles.closeBtn}
                onClick={() => setShowAddMoneyModal(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div style={styles.modalBody}>
              <label style={styles.label}>Amount (Rs.)</label>
              <input
                type="number"
                placeholder="Enter amount"
                value={addMoneyAmount}
                onChange={(e) => setAddMoneyAmount(e.target.value)}
                style={styles.input}
              />
              <div style={styles.quickAddButtons}>
                {[500, 1000, 2000, 5000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setAddMoneyAmount(amt.toString())}
                    style={styles.quickAddBtn}
                  >
                    ₹ {amt}
                  </button>
                ))}
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button
                style={styles.cancelBtn}
                onClick={() => setShowAddMoneyModal(false)}
              >
                Cancel
              </button>
              <button style={styles.confirmBtn} onClick={handleAddMoney}>
                Add Money
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    background: "#f5f5f5",
  },
  header: {
    background: "#fff",
    borderBottom: "1px solid #e0e0e0",
    padding: "20px 0",
  },
  headerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { fontSize: "28px", fontWeight: "bold", margin: 0 },
  logoutBtn: {
    padding: "10px 16px",
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    fontWeight: "600",
  },
  container: {
    display: "flex",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    gap: "20px",
    width: "100%",
    flex: 1,
  },
  sidebar: {
    width: "280px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  userCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    textAlign: "center",
    border: "1px solid #e0e0e0",
  },
  avatar: {
    width: "60px",
    height: "60px",
    background: "#3b82f6",
    color: "#fff",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: "bold",
    margin: "0 auto 12px",
  },
  userName: { margin: "0", fontSize: "18px", fontWeight: "600", color: "#111" },
  userEmail: { margin: "4px 0 0", fontSize: "12px", color: "#666" },
  walletCard: {
    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    color: "#fff",
    padding: "20px",
    borderRadius: "12px",
  },
  walletLabel: { fontSize: "12px", opacity: 0.9, marginBottom: "8px" },
  walletAmount: { fontSize: "28px", fontWeight: "bold", marginBottom: "12px" },
  addMoneyBtn: {
    width: "100%",
    padding: "10px",
    background: "rgba(255,255,255,0.2)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.4)",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
  },
  nav: { display: "flex", flexDirection: "column", gap: "6px" },
  navBtn: {
    padding: "12px 14px",
    background: "#fff",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    textAlign: "left",
    transition: "all 0.2s",
  },
  navBtnActive: {
    background: "#3b82f6",
    color: "#fff",
    borderColor: "#3b82f6",
  },
  content: { flex: 1 },
  section: {
    background: "#fff",
    padding: "24px",
    borderRadius: "12px",
    border: "1px solid #e0e0e0",
  },
  sectionTitle: { margin: "0 0 20px", fontSize: "20px", fontWeight: "600" },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px",
  },
  statBox: {
    padding: "16px",
    background: "#f9f9f9",
    borderRadius: "8px",
    border: "1px solid #e0e0e0",
  },
  statLabel: { fontSize: "12px", color: "#666", marginBottom: "8px" },
  statValue: { fontSize: "24px", fontWeight: "bold", color: "#111" },
  ordersList: { display: "flex", flexDirection: "column", gap: "12px" },
  orderCard: {
    padding: "16px",
    background: "#f9f9f9",
    borderRadius: "8px",
    border: "1px solid #e0e0e0",
  },
  orderHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  orderNumber: { fontSize: "14px", fontWeight: "600" },
  orderDate: { fontSize: "12px", color: "#666", marginTop: "4px" },
  orderStatus: {
    padding: "4px 12px",
    background: "#dcfce7",
    color: "#15803d",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  orderAmount: { fontSize: "14px", fontWeight: "600", color: "#3b82f6" },
  orderItems: { display: "flex", flexWrap: "wrap", gap: "8px" },
  itemTag: {
    padding: "4px 8px",
    background: "#e0e7ff",
    color: "#4f46e5",
    borderRadius: "4px",
    fontSize: "11px",
  },
  transactionsList: { display: "flex", flexDirection: "column", gap: "12px" },
  transactionRow: {
    padding: "16px",
    background: "#f9f9f9",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: "1px solid #e0e0e0",
  },
  txLeft: { display: "flex", alignItems: "center", gap: "12px" },
  txIcon: { fontSize: "18px" },
  txDesc: { fontSize: "14px", fontWeight: "500" },
  txDate: { fontSize: "12px", color: "#666", marginTop: "4px" },
  txAmount: { fontSize: "14px", fontWeight: "bold" },
  cartList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "20px",
  },
  cartItem: {
    display: "flex",
    gap: "12px",
    padding: "12px",
    background: "#f9f9f9",
    borderRadius: "8px",
    alignItems: "center",
  },
  cartImage: {
    width: "60px",
    height: "60px",
    objectFit: "contain",
    borderRadius: "6px",
  },
  cartInfo: { flex: 1 },
  cartTitle: { fontSize: "14px", fontWeight: "600" },
  cartPrice: { fontSize: "12px", color: "#666", marginTop: "4px" },
  cartTotal: { fontSize: "14px", fontWeight: "bold", color: "#3b82f6" },
  checkoutInfo: { paddingTop: "16px", borderTop: "1px solid #e0e0e0" },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "16px",
    fontWeight: "600",
  },
  totalAmount: { color: "#3b82f6" },
  emptyState: { padding: "40px 20px", textAlign: "center", color: "#999" },
  modal: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modalBox: {
    background: "#fff",
    borderRadius: "12px",
    width: "90%",
    maxWidth: "400px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
  },
  modalHeader: {
    padding: "20px",
    borderBottom: "1px solid #e0e0e0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeBtn: {
    width: "30px",
    height: "30px",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "18px",
    color: "#666",
  },
  modalBody: { padding: "20px" },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #d0d0d0",
    borderRadius: "6px",
    fontSize: "14px",
    marginBottom: "16px",
  },
  quickAddButtons: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "8px",
    marginBottom: "16px",
  },
  quickAddBtn: {
    padding: "10px",
    background: "#f0f0f0",
    border: "1px solid #d0d0d0",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
  },
  modalFooter: {
    padding: "16px",
    borderTop: "1px solid #e0e0e0",
    display: "flex",
    gap: "10px",
  },
  cancelBtn: {
    flex: 1,
    padding: "10px",
    background: "#f0f0f0",
    border: "1px solid #d0d0d0",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
  },
  confirmBtn: {
    flex: 1,
    padding: "10px",
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
  },
};

const CSS = `
  * { box-sizing: border-box; }
  body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; }
  @media (max-width: 768px) {
    .container { flex-direction: column; }
    .sidebar { width: 100%; }
  }
`;

export default UserDashboard;
