import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    BarElement, 
    Title, 
    Tooltip, 
    Legend, 
    ArcElement 
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { 
    FaUserPlus, 
    FaUsers, 
    FaExclamationTriangle, 
    FaSpinner, 
    FaChartPie, 
    FaChartBar, 
    FaClock, 
    FaCalendarAlt,
    FaUserInjured,
    FaUserShield
} from "react-icons/fa";
import "./Dashboard.css";

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const AdminDashboard = () => {
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL || "https://hospital-management-system-23e0.onrender.com/api";
    const [staff, setStaff] = useState([]);
    const [stats, setStats] = useState({
        totalPatients: 0,
        totalStaff: 0,
        genderDistribution: [],
        statusDistribution: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        role: "reception",
        name: "",
        specialization: ""
    });
    const [actionMessage, setActionMessage] = useState({ text: "", type: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Digital Clock Effect
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Check permissions
    useEffect(() => {
        try {
            const userData = localStorage.getItem("user");
            const user = (userData && userData !== "undefined") ? JSON.parse(userData) : null;
            if (!user || user.role !== 'admin') {
                navigate("/");
            }
        } catch (error) {
            console.error("Error parsing user data:", error);
            navigate("/");
        }
    }, [navigate]);

    const fetchData = useCallback(async (signal) => {
        setLoading(true);
        setError(null);
        try {
            const [staffRes, statsRes] = await Promise.all([
                axios.get(`${apiUrl}/admin/staff`, { signal }),
                axios.get(`${apiUrl}/admin/stats`, { signal })
            ]);
            setStaff(Array.isArray(staffRes.data) ? staffRes.data : []);
            setStats(statsRes.data);
        } catch (err) {
            if (axios.isCancel(err)) return;
            console.error("Error fetching admin data", err);
            setError("Failed to load dashboard data. Please check connection.");
        } finally {
            setLoading(false);
        }
    }, [apiUrl]);

    useEffect(() => {
        const controller = new AbortController();
        fetchData(controller.signal);
        return () => controller.abort();
    }, [fetchData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setActionMessage({ text: "", type: "" });
        try {
            await axios.post(`${apiUrl}/admin/add-staff`, formData);
            setActionMessage({ text: "Staff member added successfully!", type: "success" });
            setFormData({ username: "", password: "", role: "reception", name: "", specialization: "" });
            fetchData();
        } catch (err) {
            setActionMessage({ text: err.response?.data?.message || "Error adding staff", type: "error" });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Chart Data Preparation
    const genderChartData = {
        labels: stats.genderDistribution.map(d => d._id),
        datasets: [{
            label: 'Patients by Gender',
            data: stats.genderDistribution.map(d => d.count),
            backgroundColor: ['#3b82f6', '#ec4899', '#8b5cf6'],
            borderWidth: 0,
        }]
    };

    const statusChartData = {
        labels: stats.statusDistribution.map(d => d._id),
        datasets: [{
            label: 'Patients by Status',
            data: stats.statusDistribution.map(d => d.count),
            backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
            borderRadius: 8,
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom' },
            tooltip: { enabled: true }
        }
    };

    if (loading && staff.length === 0) {
        return (
            <div className="dashboard-loading">
                <FaSpinner className="spinner" />
                <p>Initializing Secure Admin Environment...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-container admin-theme">
            <div className="admin-header-row">
                <div className="dashboard-header">
                    <h1>Admin Command Center</h1>
                    <p className="subtitle">Real-time hospital operations oversight</p>
                </div>
                <div className="digital-clock-card">
                    <div className="clock-time">
                        <FaClock className="icon-pulse" />
                        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                    <div className="clock-date">
                        <FaCalendarAlt />
                        {currentTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>
            </div>

            {error && (
                <div className="error-banner">
                    <FaExclamationTriangle />
                    <span>{error}</span>
                    <button onClick={fetchData}>Retry Sync</button>
                </div>
            )}

            <div className="stats-grid">
                <div className="stat-card blue">
                    <FaUsers />
                    <div className="stat-info">
                        <h3>Total Staff</h3>
                        <p className="stat-value">{stats.totalStaff}</p>
                    </div>
                </div>
                <div className="stat-card green">
                    <FaUserInjured />
                    <div className="stat-info">
                        <h3>Total Patients</h3>
                        <p className="stat-value">{stats.totalPatients}</p>
                    </div>
                </div>
                <div className="stat-card purple">
                    <FaUserShield />
                    <div className="stat-info">
                        <h3>Active Roles</h3>
                        <p className="stat-value">5</p>
                    </div>
                </div>
            </div>

            <div className="viz-section">
                <div className="viz-card">
                    <div className="section-header">
                        <FaChartPie />
                        <h2>Gender Distribution</h2>
                    </div>
                    <div className="chart-wrapper">
                        <Pie data={genderChartData} options={chartOptions} />
                    </div>
                </div>
                <div className="viz-card">
                    <div className="section-header">
                        <FaChartBar />
                        <h2>Patient Workflow Status</h2>
                    </div>
                    <div className="chart-wrapper">
                        <Bar data={statusChartData} options={chartOptions} />
                    </div>
                </div>
            </div>

            <div className="admin-grid main-content-grid">
                <div className="form-section glass-card">
                    <div className="section-header">
                        <FaUserPlus />
                        <h2>Staff Onboarding</h2>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input 
                                type="text" 
                                placeholder="e.g. Dr. Jane Wilson" 
                                value={formData.name} 
                                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>Access Username</label>
                            <input 
                                type="text" 
                                placeholder="Unique system ID" 
                                value={formData.username} 
                                onChange={(e) => setFormData({...formData, username: e.target.value})} 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>Security Password</label>
                            <input 
                                type="password" 
                                placeholder="Min 8 characters" 
                                value={formData.password} 
                                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                                required 
                            />
                        </div>
                        <div className="form-group">
                            <label>Departmental Role</label>
                            <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                                <option value="reception">Receptionist</option>
                                <option value="doctor">Consultant Doctor</option>
                                <option value="pharmacy">Pharmacist</option>
                                <option value="laboratory">Lab Technician</option>
                            </select>
                        </div>
                        {formData.role === 'doctor' && (
                            <div className="form-group">
                                <label>Clinical Specialization</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Oncology" 
                                    value={formData.specialization} 
                                    onChange={(e) => setFormData({...formData, specialization: e.target.value})} 
                                    required
                                />
                            </div>
                        )}
                        <button type="submit" className="onboard-btn" disabled={isSubmitting}>
                            {isSubmitting ? "Syncing..." : "Authorize Access"}
                        </button>
                        {actionMessage.text && (
                            <p className={`message ${actionMessage.type}`}>
                                {actionMessage.text}
                            </p>
                        )}
                    </form>
                </div>

                <div className="list-section glass-card">
                    <div className="section-header">
                        <FaUsers />
                        <h2>Personnel Directory</h2>
                    </div>
                    
                    {staff.length === 0 ? (
                        <div className="empty-state">
                            <p>No active staff sessions found.</p>
                        </div>
                    ) : (
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Staff Name</th>
                                        <th>Role</th>
                                        <th>Departmental Info</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {staff.map(s => (
                                        <tr key={s._id}>
                                            <td className="font-bold">{s.name}</td>
                                            <td>
                                                <span className={`role-badge ${s.role}`}>
                                                    {s.role}
                                                </span>
                                            </td>
                                            <td>{s.specialization || "General Access"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
