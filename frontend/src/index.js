import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { HashRouter, Route, Routes } from "react-router-dom";
import axios from "axios";
import reportWebVitals from './reportWebVitals';
import Home from './Home';
import Login from './components/login';
import ReceptionDashboard from './components/ReceptionDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import PharmacyDashboard from './components/PharmacyDashboard';
import LabDashboard from './components/LabDashboard';
import AdminDashboard from './components/AdminDashboard';
import Navbar from './components/Navbar';

// Global Axios Interceptor to handle Aborted requests gracefully
axios.interceptors.response.use(
  response => response,
  error => {
    if (axios.isCancel(error)) {
      return new Promise(() => {}); // Silence canceled requests
    }
    return Promise.reject(error);
  }
);

// Silence common browser extension noise in console if possible
const originalError = console.error;
console.error = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('message channel closed before a response was received')) {
    return;
  }
  originalError.apply(console, args);
};

const DashboardWrapper = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <HashRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reception" element={<DashboardWrapper><ReceptionDashboard /></DashboardWrapper>} />
      <Route path="/doctor" element={<DashboardWrapper><DoctorDashboard /></DashboardWrapper>} />
      <Route path="/pharmacy" element={<DashboardWrapper><PharmacyDashboard /></DashboardWrapper>} />
      <Route path="/lab" element={<DashboardWrapper><LabDashboard /></DashboardWrapper>} />
      <Route path="/admin" element={<DashboardWrapper><AdminDashboard /></DashboardWrapper>} />
    </Routes>
  </HashRouter>
);

reportWebVitals();
