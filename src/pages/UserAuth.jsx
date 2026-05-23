import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaLock, FaEnvelope, FaPhone } from "react-icons/fa";
import { toast } from "react-toastify";

const API = "http://localhost:8000/api/users";

const UserAuth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("userToken");
    if (token) {
      navigate("/user-dashboard");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        if (!formData.email || !formData.password) {
          toast.error("Email and password required");
          setLoading(false);
          return;
        }

        const response = await axios.post(`${API}/login`, {
          email: formData.email,
          password: formData.password,
        });

        localStorage.setItem("userToken", response.data.token);
        localStorage.setItem("userName", response.data.user.name);
        toast.success("Login successful!");
        navigate("/user-dashboard");
      } else {
        if (
          !formData.name ||
          !formData.email ||
          !formData.password ||
          !formData.confirmPassword
        ) {
          toast.error("All fields required");
          setLoading(false);
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          toast.error("Passwords don't match");
          setLoading(false);
          return;
        }

        if (formData.password.length < 6) {
          toast.error("Password must be at least 6 characters");
          setLoading(false);
          return;
        }

        const response = await axios.post(`${API}/register`, {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
        });

        localStorage.setItem("userToken", response.data.token);
        localStorage.setItem("userName", response.data.user.name);
        toast.success("Registration successful!");
        navigate("/user-dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="auth-root">
        <div className="auth-container">
          <div className="auth-box">
            <div className="auth-header">
              <div className="auth-logo">🏪</div>
              <h1>{isLogin ? "Welcome Back" : "Join Our Store"}</h1>
              <p>
                {isLogin
                  ? "Sign in to your account"
                  : "Create an account to get started"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {!isLogin && (
                <>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <div className="form-input-wrapper">
                      <FaUser className="form-icon" />
                      <input
                        type="text"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone (Optional)</label>
                    <div className="form-input-wrapper">
                      <FaPhone className="form-icon" />
                      <input
                        type="tel"
                        name="phone"
                        placeholder="9876543210"
                        value={formData.phone}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="form-input-wrapper">
                  <FaEnvelope className="form-icon" />
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="form-input-wrapper">
                  <FaLock className="form-icon" />
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <div className="form-input-wrapper">
                    <FaLock className="form-icon" />
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                </div>
              )}

              <button type="submit" className="auth-btn" disabled={loading}>
                {loading
                  ? "Loading..."
                  : isLogin
                    ? "Sign In"
                    : "Create Account"}
              </button>
            </form>

            <div className="auth-divider">
              <span>or</span>
            </div>

            <div className="auth-toggle">
              <p>
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}
                <button
                  type="button"
                  className="toggle-btn"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setFormData({
                      name: "",
                      email: "",
                      password: "",
                      confirmPassword: "",
                      phone: "",
                    });
                  }}
                >
                  {isLogin ? "Sign Up" : "Sign In"}
                </button>
              </p>
            </div>

            <div className="auth-footer">
              <button
                type="button"
                className="back-to-store"
                onClick={() => navigate("/")}
              >
                ← Back to Store
              </button>
            </div>
          </div>

          <div className="auth-benefits">
            <h3>Why Sign Up?</h3>
            <div className="benefit">
              <span className="benefit-icon">💳</span>
              <span>Instant wallet with ₹1000</span>
            </div>
            <div className="benefit">
              <span className="benefit-icon">🛒</span>
              <span>Save your cart items</span>
            </div>
            <div className="benefit">
              <span className="benefit-icon">📦</span>
              <span>Track your orders</span>
            </div>
            <div className="benefit">
              <span className="benefit-icon">💰</span>
              <span>Easy wallet management</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .auth-root {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  .auth-container {
    display: flex;
    gap: 40px;
    max-width: 900px;
    width: 100%;
    align-items: center;
  }

  .auth-box {
    background: white;
    border-radius: 16px;
    padding: 40px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    flex: 1;
    min-width: 350px;
    animation: slideIn 0.5s ease;
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .auth-header {
    text-align: center;
    margin-bottom: 30px;
  }

  .auth-logo {
    font-size: 48px;
    margin-bottom: 16px;
  }

  .auth-header h1 {
    font-size: 28px;
    font-weight: 700;
    color: #111;
    margin-bottom: 8px;
  }

  .auth-header p {
    color: #666;
    font-size: 14px;
  }

  .auth-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 20px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
  }

  .form-label {
    font-size: 12px;
    font-weight: 600;
    color: #333;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
  }

  .form-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  .form-icon {
    position: absolute;
    left: 14px;
    color: #999;
    font-size: 14px;
    pointer-events: none;
  }

  .form-input {
    width: 100%;
    padding: 12px 14px 12px 40px;
    border: 1.5px solid #ddd;
    border-radius: 8px;
    font-size: 14px;
    font-family: inherit;
    transition: all 0.2s;
    outline: none;
  }

  .form-input:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  .auth-btn {
    padding: 12px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 8px;
    transition: all 0.3s;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  }

  .auth-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
  }

  .auth-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .auth-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 20px 0;
    color: #999;
    font-size: 12px;
  }

  .auth-divider::before,
  .auth-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #ddd;
  }

  .auth-toggle {
    text-align: center;
    font-size: 14px;
    color: #666;
  }

  .toggle-btn {
    background: none;
    border: none;
    color: #667eea;
    font-weight: 600;
    cursor: pointer;
    margin-left: 4px;
    text-decoration: underline;
    font-size: 14px;
  }

  .toggle-btn:hover {
    color: #764ba2;
  }

  .auth-footer {
    margin-top: 16px;
    text-align: center;
  }

  .back-to-store {
    background: #f0f0f0;
    border: none;
    padding: 10px 16px;
    border-radius: 6px;
    font-size: 13px;
    cursor: pointer;
    color: #666;
    font-weight: 500;
    transition: all 0.2s;
  }

  .back-to-store:hover {
    background: #e0e0e0;
    color: #333;
  }

  .auth-benefits {
    color: white;
    flex: 1;
    min-width: 280px;
  }

  .auth-benefits h3 {
    font-size: 24px;
    margin-bottom: 24px;
    font-weight: 700;
  }

  .benefit {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    font-size: 15px;
    opacity: 0.95;
  }

  .benefit-icon {
    font-size: 24px;
  }

  @media (max-width: 768px) {
    .auth-container {
      flex-direction: column;
      gap: 20px;
    }

    .auth-benefits {
      min-width: 100%;
      text-align: center;
    }

    .benefit {
      justify-content: center;
    }

    .auth-box {
      padding: 30px 20px;
    }

    .auth-header h1 {
      font-size: 24px;
    }

    .auth-logo {
      font-size: 40px;
    }
  }
`;

export default UserAuth;
