import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  FaStore,
  FaShoppingBag,
  FaBolt,
  FaHome,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Navbar = ({ cartCount, cartItems = [], clearCart, setSearchTerm }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const categories = [...new Set(cartItems.map((item) => item.category))];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

        .nb-root {
          position: sticky; top: 0; z-index: 100;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.3s ease;
        }
        .nb-root.scrolled {
          filter: drop-shadow(0 4px 24px rgba(0,0,0,0.08));
        }

        /* Glass bar */
        .nb-bar {
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border-bottom: 1px solid rgba(0,0,0,0.06);
          padding: 0 28px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          transition: background 0.3s;
        }
        .nb-root.scrolled .nb-bar {
          background: rgba(255,255,255,0.97);
        }

        /* Logo */
        .nb-logo {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none; cursor: pointer; flex-shrink: 0;
        }
        .nb-logo-mark {
          width: 36px; height: 36px;
          background: #111;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
        }
        .nb-logo-mark::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
          opacity: 0;
          transition: opacity 0.25s;
        }
        .nb-logo:hover .nb-logo-mark::after { opacity: 1; }
        .nb-logo-mark svg { position: relative; z-index: 1; }
        .nb-logo-text {
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.5px;
          display: none;
        }
        @media (min-width: 480px) { .nb-logo-text { display: block; } }
        .nb-logo-text span { color: #3b82f6; }

        /* Nav links */
        .nb-links {
          display: none;
          align-items: center;
          gap: 2px;
        }
        @media (min-width: 900px) { .nb-links { display: flex; } }

        .nb-link {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 14px;
          border-radius: 8px;
          font-size: 13.5px;
          font-weight: 500;
          color: #475569;
          border: none; background: none; cursor: pointer;
          transition: all 0.18s;
          text-decoration: none;
          white-space: nowrap;
        }
        .nb-link:hover {
          color: #0f172a;
          background: rgba(0,0,0,0.04);
        }
        .nb-link svg { font-size: 12px; opacity: 0.7; }

        .nb-link-admin {
          background: #0f172a;
          color: #fff !important;
          padding: 7px 16px;
          font-weight: 600;
          letter-spacing: 0.01em;
        }
        .nb-link-admin:hover {
          background: #1e293b !important;
          color: #fff !important;
        }
        .nb-link-admin svg { opacity: 1; }

        /* Divider pill */
        .nb-divider {
          width: 1px; height: 18px;
          background: rgba(0,0,0,0.1);
          margin: 0 4px;
        }

        /* Right side */
        .nb-right {
          display: flex; align-items: center; gap: 8px;
          flex-shrink: 0;
        }

        /* Cart button */
        .nb-cart-btn {
          position: relative;
          width: 42px; height: 42px;
          border-radius: 12px;
          border: 1.5px solid rgba(0,0,0,0.08);
          background: #fff;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all 0.18s;
          color: #374151;
        }
        .nb-cart-btn:hover {
          border-color: #3b82f6;
          color: #3b82f6;
          background: rgba(59,130,246,0.04);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59,130,246,0.12);
        }
        .nb-cart-badge {
          position: absolute; top: -6px; right: -6px;
          background: #3b82f6;
          color: #fff;
          font-size: 10px; font-weight: 700;
          min-width: 18px; height: 18px;
          border-radius: 100px;
          display: flex; align-items: center; justify-content: center;
          border: 2px solid #fff;
          font-family: 'DM Sans', sans-serif;
          padding: 0 4px;
          animation: badgePop 0.25s cubic-bezier(.4,0,.2,1);
        }
        @keyframes badgePop {
          from { transform: scale(0.4); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }

        /* Cart Dropdown */
        .nb-cart-wrap { position: relative; }
        .nb-dropdown {
          position: absolute; top: calc(100% + 12px); right: 0;
          width: 300px;
          background: #fff;
          border: 1px solid rgba(0,0,0,0.07);
          border-radius: 18px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.6) inset;
          overflow: hidden;
          transition: opacity 0.2s, transform 0.2s;
          transform-origin: top right;
        }
        .nb-dropdown.open  { opacity: 1; transform: scale(1) translateY(0); pointer-events: all; }
        .nb-dropdown.close { opacity: 0; transform: scale(0.96) translateY(-6px); pointer-events: none; }

        .nb-dd-head {
          padding: 16px 18px 12px;
          border-bottom: 1px solid rgba(0,0,0,0.05);
          display: flex; align-items: center; justify-content: space-between;
        }
        .nb-dd-title {
          font-family: 'Syne', sans-serif;
          font-size: 14px; font-weight: 700;
          color: #0f172a;
          letter-spacing: -0.2px;
        }
        .nb-dd-count {
          font-size: 11px; font-weight: 600;
          background: #f1f5f9;
          color: #64748b;
          padding: 3px 10px;
          border-radius: 100px;
        }

        .nb-dd-body { padding: 14px 18px; }

        .nb-dd-label {
          font-size: 10px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 1.5px;
          color: #94a3b8; margin-bottom: 10px;
        }
        .nb-dd-cats {
          display: flex; flex-wrap: wrap; gap: 6px;
          margin-bottom: 16px;
        }
        .nb-dd-cat {
          font-size: 11px; font-weight: 600;
          background: rgba(59,130,246,0.06);
          color: #3b82f6;
          border: 1px solid rgba(59,130,246,0.15);
          padding: 4px 12px;
          border-radius: 100px;
          text-transform: capitalize;
        }

        .nb-dd-empty {
          text-align: center; padding: 28px 0;
        }
        .nb-dd-empty-icon {
          font-size: 28px; color: #e2e8f0; margin-bottom: 8px;
        }
        .nb-dd-empty-text {
          font-size: 13px; color: #94a3b8; font-weight: 500;
        }

        .nb-clear-btn {
          width: 100%; padding: 11px;
          border-radius: 12px; border: none;
          background: #fff0f0;
          color: #ef4444;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 600;
          cursor: pointer;
          transition: all 0.18s;
          display: flex; align-items: center; justify-content: center; gap: 6px;
        }
        .nb-clear-btn:hover {
          background: #ef4444; color: #fff;
        }
      `}</style>

      <nav className={`nb-root ${scrolled ? "scrolled" : ""}`}>
        <div className="nb-bar">
          {/* Logo */}
          <div className="nb-logo" onClick={() => navigate("/")}>
            <div className="nb-logo-mark">
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
            <span className="nb-logo-text">
              STORE<span>.</span>
            </span>
          </div>

          {/* Nav Links */}
          <div className="nb-links">
            <a href="#" className="nb-link">
              <FaHome /> Home
            </a>
            <a href="#" className="nb-link">
              <FaBolt /> Flash Sales
            </a>
            <div className="nb-divider" />
            <button
              className="nb-link nb-link-admin"
              onClick={() => {
                toast.info("Directed to Admin...", { autoClose: 1000 });
                setTimeout(() => navigate("/admin-dashboard"), 1000);
              }}
            >
              <FaStore /> Admin Dashboard
            </button>
          </div>

          {/* Right: Cart */}
          <div className="nb-right">
            <div
              className="nb-cart-wrap"
              onMouseEnter={() => setIsOpen(true)}
              onMouseLeave={() => setIsOpen(false)}
              onClick={() => setIsOpen((v) => !v)}
            >
              <button className="nb-cart-btn" aria-label="Cart">
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                {cartCount > 0 && (
                  <span className="nb-cart-badge" key={cartCount}>
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Dropdown */}
              <div
                className={`nb-dropdown ${isOpen ? "open" : "close"}`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="nb-dd-head">
                  <span className="nb-dd-title">My Cart</span>
                  <span className="nb-dd-count">
                    {cartCount} item{cartCount !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="nb-dd-body">
                  {cartCount > 0 ? (
                    <>
                      <div className="nb-dd-label">Categories in cart</div>
                      <div className="nb-dd-cats">
                        {categories.map((cat, i) => (
                          <span key={i} className="nb-dd-cat">
                            {cat}
                          </span>
                        ))}
                      </div>
                      <button
                        className="nb-clear-btn"
                        onClick={() => {
                          clearCart();
                          setIsOpen(false);
                        }}
                      >
                        <FaTimes size={11} /> Clear Cart
                      </button>
                    </>
                  ) : (
                    <div className="nb-dd-empty">
                      <div className="nb-dd-empty-icon">
                        <FaShoppingBag />
                      </div>
                      <p className="nb-dd-empty-text">Your cart is empty</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
