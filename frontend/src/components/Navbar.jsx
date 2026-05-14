import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import { FaHeartbeat, FaLock, FaSignOutAlt } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  let user = null;
  try {
    const userData = localStorage.getItem("user");
    if (userData && userData !== "undefined") {
      user = JSON.parse(userData);
    }
  } catch (error) {
    console.error("Error parsing user data:", error);
    user = null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleAdminLogin = () => {
    navigate("/?login=admin");
  };

  return (
    <header className="navbar">
      <div className="navbar-left" onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>
        <div className="navbar-logo">
          <FaHeartbeat className="logo-icon" />
        </div>
        <div className="navbar-text">
          <h2 className="app-name">MediFlow</h2>
          <p className="app-subtitle">Hospital Management System</p>
        </div>
      </div>

      <div className="navbar-right">
        {user ? (
          <div className="user-info">
            <span>Welcome, {user.name} ({user.role})</span>
            <button className="logout-btn" onClick={handleLogout}>
              <FaSignOutAlt className="logout-icon" />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <button className="login-btn" onClick={handleAdminLogin}>
            <FaLock className="lock-icon" />
            <span>Admin Login</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
