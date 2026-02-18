import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaLock, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/admins/login",
        {
          email: username,
          password: password,
        },
      );

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        toast.success("Login Successful!", { autoClose: 1000 });
        navigate("/admin-dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          width: 100%;
          display: flex;
          font-family: 'DM Sans', sans-serif;
          background: #080c14;
          overflow: hidden;
          position: relative;
        }

        /* Left decorative panel */
        .left-panel {
          display: none;
          flex: 1;
          position: relative;
          background: linear-gradient(135deg, #0d1117 0%, #0a1628 100%);
          border-right: 1px solid rgba(255,255,255,0.04);
          overflow: hidden;
          padding: 60px;
          flex-direction: column;
          justify-content: space-between;
        }

        @media (min-width: 1024px) {
          .left-panel { display: flex; }
        }

        .grid-bg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(99,179,237,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,179,237,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        .glow-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.15;
        }
        .orb-1 { width: 400px; height: 400px; background: #3b82f6; top: -100px; left: -100px; }
        .orb-2 { width: 300px; height: 300px; background: #6366f1; bottom: -50px; right: -80px; }

        .brand {
          position: relative;
          z-index: 2;
        }

        .brand-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          box-shadow: 0 0 30px rgba(99,102,241,0.4);
        }

        .brand-name {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 22px;
          color: #fff;
          letter-spacing: -0.3px;
        }

        .brand-sub {
          font-size: 13px;
          color: rgba(255,255,255,0.3);
          margin-top: 4px;
          letter-spacing: 2px;
          text-transform: uppercase;
          font-weight: 500;
        }

        .left-content {
          position: relative;
          z-index: 2;
        }

        .left-heading {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 42px;
          line-height: 1.1;
          color: #fff;
          margin-bottom: 20px;
          letter-spacing: -1px;
        }

        .left-heading span {
          background: linear-gradient(90deg, #60a5fa, #818cf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .left-desc {
          color: rgba(255,255,255,0.35);
          font-size: 15px;
          line-height: 1.7;
          max-width: 340px;
        }

        .stat-cards {
          display: flex;
          gap: 12px;
          margin-top: 48px;
        }

        .stat-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 18px 22px;
          flex: 1;
          backdrop-filter: blur(8px);
        }

        .stat-value {
          font-family: 'Syne', sans-serif;
          font-size: 26px;
          font-weight: 700;
          color: #fff;
        }

        .stat-label {
          font-size: 11px;
          color: rgba(255,255,255,0.3);
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-top: 4px;
          font-weight: 500;
        }

        .left-footer {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .security-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(16,185,129,0.1);
          border: 1px solid rgba(16,185,129,0.2);
          border-radius: 100px;
          padding: 8px 16px;
        }

        .badge-dot {
          width: 7px;
          height: 7px;
          background: #10b981;
          border-radius: 50%;
          box-shadow: 0 0 8px #10b981;
          animation: pulse-dot 2s ease infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.8); }
        }

        .badge-text {
          font-size: 12px;
          color: #10b981;
          font-weight: 500;
          letter-spacing: 0.3px;
        }

        /* Right panel - form */
        .right-panel {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
          background: #080c14;
          position: relative;
        }

        @media (min-width: 1024px) {
          .right-panel { width: 480px; flex-shrink: 0; }
        }

        .form-container {
          width: 100%;
          max-width: 400px;
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .form-container.mounted {
          opacity: 1;
          transform: translateY(0);
        }

        .form-header {
          margin-bottom: 40px;
        }

        .form-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(99,102,241,0.12);
          border: 1px solid rgba(99,102,241,0.25);
          border-radius: 100px;
          padding: 6px 14px;
          margin-bottom: 24px;
        }

        .eyebrow-dot {
          width: 6px;
          height: 6px;
          background: #818cf8;
          border-radius: 50%;
        }

        .eyebrow-text {
          font-size: 11px;
          font-weight: 600;
          color: #818cf8;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        .form-title {
          font-family: 'Syne', sans-serif;
          font-size: 32px;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.8px;
          line-height: 1.15;
          margin-bottom: 10px;
        }

        .form-subtitle {
          font-size: 14px;
          color: rgba(255,255,255,0.35);
          line-height: 1.6;
        }

        .field-group {
          margin-bottom: 20px;
        }

        .field-label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
          letter-spacing: 1.2px;
          margin-bottom: 10px;
        }

        .field-wrapper {
          position: relative;
        }

        .field-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.2);
          font-size: 13px;
          transition: color 0.2s;
          pointer-events: none;
        }

        .field-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          color: #fff;
          font-size: 14.5px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 400;
          padding: 14px 16px 14px 44px;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          letter-spacing: 0.2px;
        }

        .field-input::placeholder {
          color: rgba(255,255,255,0.18);
        }

        .field-input:focus {
          border-color: rgba(99,102,241,0.6);
          background: rgba(99,102,241,0.06);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
        }

        .field-input:focus + .field-icon,
        .field-wrapper:focus-within .field-icon {
          color: #818cf8;
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 28px 0;
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.06);
        }

        .divider-text {
          font-size: 11px;
          color: rgba(255,255,255,0.2);
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 500;
        }

        .submit-btn {
          width: 100%;
          background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.3px;
          border: none;
          border-radius: 12px;
          padding: 15px 24px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 8px 24px rgba(99,102,241,0.35), 0 2px 8px rgba(0,0,0,0.3);
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          position: relative;
          overflow: hidden;
        }

        .submit-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
        }

        .submit-btn:hover:not(:disabled) {
          opacity: 0.92;
          transform: translateY(-1px);
          box-shadow: 0 12px 32px rgba(99,102,241,0.45), 0 4px 12px rgba(0,0,0,0.3);
        }

        .submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .form-footer {
          margin-top: 32px;
          text-align: center;
        }

        .footer-text {
          font-size: 11.5px;
          color: rgba(255,255,255,0.18);
          letter-spacing: 2px;
          text-transform: uppercase;
          font-weight: 500;
        }

        .footer-links {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          margin-top: 16px;
        }

        .footer-link {
          font-size: 12px;
          color: rgba(255,255,255,0.2);
          text-decoration: none;
          transition: color 0.2s;
          cursor: pointer;
        }

        .footer-link:hover { color: rgba(255,255,255,0.5); }

        .footer-dot {
          width: 3px;
          height: 3px;
          background: rgba(255,255,255,0.1);
          border-radius: 50%;
        }

        /* Spinner */
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        /* Corner decoration */
        .corner-deco {
          position: absolute;
          top: 0;
          right: 0;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle at top right, rgba(99,102,241,0.08), transparent 70%);
          pointer-events: none;
        }
      `}</style>

      <div className="login-root">
        {/* Left Decorative Panel */}
        <div className="left-panel">
          <div className="grid-bg" />
          <div className="glow-orb orb-1" />
          <div className="glow-orb orb-2" />

          <div className="brand">
            <div className="brand-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="brand-name">NexusAdmin</div>
            <div className="brand-sub">Control Platform</div>
          </div>

          <div className="left-content">
            <h1 className="left-heading">
              Complete control
              <br />
              over your <span>infrastructure</span>
            </h1>
            <p className="left-desc">
              Manage users, monitor analytics, configure settings, and oversee
              all system operations from a single, unified admin interface.
            </p>

            <div className="stat-cards">
              <div className="stat-card">
                <div className="stat-value">99.9%</div>
                <div className="stat-label">Uptime</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">256-bit</div>
                <div className="stat-label">Encryption</div>
              </div>
            </div>
          </div>

          <div className="left-footer">
            <div className="security-badge">
              <div className="badge-dot" />
              <span className="badge-text">All systems operational</span>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="right-panel">
          <div className="corner-deco" />

          <div className={`form-container ${mounted ? "mounted" : ""}`}>
            <div className="form-header">
              <div className="form-eyebrow">
                <div className="eyebrow-dot" />
                <span className="eyebrow-text">Administrator Access</span>
              </div>
              <h2 className="form-title">Welcome back</h2>
              <p className="form-subtitle">
                Sign in to access the admin dashboard and manage your platform.
              </p>
            </div>

            <form onSubmit={handleLogin}>
              <div className="field-group">
                <label className="field-label">Email Address</label>
                <div className="field-wrapper">
                  <input
                    type="email"
                    className="field-input"
                    placeholder="admin@example.com"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <span className="field-icon">
                    <FaUser />
                  </span>
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">Password</label>
                <div className="field-wrapper">
                  <input
                    type="password"
                    className="field-input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span className="field-icon">
                    <FaLock />
                  </span>
                </div>
              </div>

              <div className="divider">
                <div className="divider-line" />
                <span className="divider-text">Secure Login</span>
                <div className="divider-line" />
              </div>

              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="spinner" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Access Dashboard</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className="form-footer">
              <div className="footer-text">© 2026 Ahmad • Secure System</div>
              <div className="footer-links">
                <span className="footer-link">Privacy Policy</span>
                <div className="footer-dot" />
                <span className="footer-link">Terms of Use</span>
                <div className="footer-dot" />
                <span className="footer-link">Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
