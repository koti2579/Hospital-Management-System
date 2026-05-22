
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const controller = new AbortController();
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "https://hospital-management-system-23e0.onrender.com/api";
      const res = await axios.post(`${apiUrl}/auth/login`, { username, password }, { signal: controller.signal });
      const { token, user } = res.data;
      
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      
      alert(`Welcome ${user.name}!`);
      
      // Redirect based on role
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
    <div className="login-container">
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
        <button className="back-btn" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default Login;