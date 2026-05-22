
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserShield, FaUserMd, FaArrowLeft } from "react-icons/fa";
import "./login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    // ... same login logic ...
    e.preventDefault();
    const controller = new AbortController();
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "https://hospital-management-system-23e0.onrender.com/api";
      const res = await axios.post(`${apiUrl}/auth/login`, { username, password }, { signal: controller.signal });
      const { token, user } = res.data;
      
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      alert(`Welcome ${user.name}!`);
      
      switch(user.role) {
        case 'admin': navigate("/admin"); break;
        case 'reception': navigate("/reception"); break;
        case 'doctor': navigate("/doctor"); break;
        case 'pharmacy': navigate("/pharmacy"); break;
        case 'lab': navigate("/lab"); break;
        default: navigate("/");
      }
    } catch (err) {
      if (axios.isCancel(err)) return;
      alert(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="login-page-wrapper">
      <aside className="login-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <FaUserShield size={24} />
            <span>Admin Portal</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          <button className="nav-item active">
            <FaUserShield size={18} />
            <span>Staff Login</span>
          </button>
          <button className="nav-item patient-portal-btn" onClick={() => navigate("/patient-login")}>
            <FaUserMd size={18} />
            <span>Patient Portal</span>
          </button>
        </nav>
        <div className="sidebar-footer">
          <button className="back-home-btn" onClick={() => navigate("/")}>
            <FaArrowLeft size={14} />
            <span>Back to Home</span>
          </button>
        </div>
      </aside>

      <main className="login-main-content">
        <div className="login-card">
          <h2>Hospital Management Login</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input
                id="username"
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                id="password"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-submit-btn">
              Login
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Login;