import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./login.css";

function PatientLogin() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
      const res = await axios.post(`${apiUrl}/auth/patient-login`, { phoneNumber }, { withCredentials: true });
      
       const { patient, token } = res.data;
      localStorage.setItem("patient", JSON.stringify(patient));
      if (token) localStorage.setItem("patientToken", token);
      
      alert(`Welcome ${patient.name}!`);
      navigate("/patient-dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your phone number.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Patient Portal Login</h2>
        <p>Access your medical records securely</p>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number:</label>
            <input
              id="phoneNumber"
              type="tel"
              name="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your registered phone number"
              required
            />
          </div>
          {error && <p className="error-msg">{error}</p>}
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

export default PatientLogin;
