import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
    FaPrescriptionBottleAlt, 
    FaBoxes, 
    FaExclamationCircle, 
    FaCheckCircle, 
    FaSpinner, 
    FaCapsules, 
    FaTablets, 
    FaTint, 
    FaSyringe, 
    FaPumpMedical,
    FaSearch,
    FaExclamationTriangle
} from "react-icons/fa";
import "./Dashboard.css";

const PharmacyDashboard = () => {
    const navigate = useNavigate();
    const [prescriptions, setPrescriptions] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [inventorySearch, setInventorySearch] = useState("");

    // Check for pharmacy permissions
    useEffect(() => {
        try {
            const userData = localStorage.getItem("user");
            const user = (userData && userData !== "undefined") ? JSON.parse(userData) : null;
            if (!user || user.role !== 'pharmacy') {
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
            const [prescRes, invRes] = await Promise.all([
                axios.get("http://localhost:5000/api/pharmacy/prescriptions", { signal }),
                axios.get("http://localhost:5000/api/pharmacy/inventory", { signal })
            ]);
            setPrescriptions(Array.isArray(prescRes.data) ? prescRes.data : []);
            setInventory(Array.isArray(invRes.data) ? invRes.data : []);
        } catch (err) {
            if (axios.isCancel(err)) return;
            console.error("Error fetching pharmacy data", err);
            setError("Synchronization failure. Please check backend connectivity.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        fetchData(controller.signal);
        return () => controller.abort();
    }, [fetchData]);

    const handleIssue = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/pharmacy/dispense/${id}`);
            alert("Digital prescription finalized and medicines issued!");
            fetchData();
        } catch (err) {
            alert("Error finalizing dispensing process.");
        }
    };

    const getCategoryIcon = (category) => {
        switch(category) {
            case 'Tablet': return <FaTablets />;
            case 'Capsule': return <FaCapsules />;
            case 'Syrup': return <FaTint />;
            case 'Injection': return <FaSyringe />;
            case 'Ointment': return <FaPumpMedical />;
            default: return <FaPrescriptionBottleAlt />;
        }
    };

    const getStockLevelClass = (stock, min) => {
        if (stock <= 0) return 'stock-out';
        if (stock <= min) return 'stock-low';
        return 'stock-good';
    };

    const filteredInventory = inventory.filter(item => 
        item.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
        item.category.toLowerCase().includes(inventorySearch.toLowerCase())
    );

    if (loading && inventory.length === 0) {
        return (
            <div className="dashboard-loading">
                <FaSpinner className="spinner" />
                <p>Initializing Secure Pharmacy Interface...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-container pharmacy-theme">
            <div className="dashboard-header">
                <h1>Pharmacy Management Console</h1>
                <p className="subtitle">Real-time prescription processing and inventory control</p>
            </div>

            {error && (
                <div className="error-banner">
                    <FaExclamationTriangle />
                    <span>{error}</span>
                    <button onClick={fetchData}>Sync System</button>
                </div>
            )}

            <div className="pharmacy-grid">
                {/* Pending Prescriptions */}
                <div className="prescription-section glass-card">
                    <div className="section-header">
                        <FaPrescriptionBottleAlt />
                        <h2>Pending Dispensations</h2>
                    </div>
                    
                    <div className="prescription-list-wrapper">
                        {prescriptions.length === 0 ? (
                            <div className="empty-state">
                                <p>No pending prescriptions in queue.</p>
                            </div>
                        ) : (
                            prescriptions.map((p) => (
                                <div key={p._id} className="prescription-card">
                                    <div className="p-card-header">
                                        <div className="p-patient-info">
                                            <h3>{p.patientId?.name}</h3>
                                            <span>Age: {p.patientId?.age} • Dr. {p.doctorId?.name}</span>
                                        </div>
                                        <button className="issue-btn" onClick={() => handleIssue(p._id)}>
                                            <FaCheckCircle /> Finalize & Issue
                                        </button>
                                    </div>
                                    <div className="medication-details">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Medicine</th>
                                                    <th>Dosage</th>
                                                    <th>Duration</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {p.medicines.map((m, idx) => (
                                                    <tr key={idx}>
                                                        <td>{m.name}</td>
                                                        <td>{m.dosage}</td>
                                                        <td>{m.duration}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Inventory Management */}
                <div className="inventory-section glass-card">
                    <div className="section-header">
                        <FaBoxes />
                        <h2>Medicine Inventory</h2>
                        <div className="inventory-search">
                            <FaSearch />
                            <input 
                                type="text" 
                                placeholder="Search inventory..." 
                                value={inventorySearch}
                                onChange={(e) => setInventorySearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="inventory-grid-wrapper">
                        {filteredInventory.length === 0 ? (
                            <div className="empty-state">
                                <p>No matching medicines found.</p>
                            </div>
                        ) : (
                            <div className="inventory-grid">
                                {filteredInventory.map((item) => (
                                    <div key={item._id} className={`inventory-card ${getStockLevelClass(item.stock, item.minThreshold)}`}>
                                        <div className="inv-icon">
                                            {getCategoryIcon(item.category)}
                                        </div>
                                        <div className="inv-info">
                                            <h3>{item.name}</h3>
                                            <span className="inv-cat">{item.category}</span>
                                            <div className="stock-meter">
                                                <div className="stock-label">
                                                    <span>Stock Level</span>
                                                    <span>{item.stock} {item.unit}</span>
                                                </div>
                                                <div className="progress-bar-bg">
                                                    <div 
                                                        className="progress-bar-fill" 
                                                        style={{ width: `${Math.min((item.stock / (item.minThreshold * 5)) * 100, 100)}%` }}
                                                    ></div>
                                                </div>
                                                {item.stock <= item.minThreshold && (
                                                    <div className="low-stock-alert">
                                                        <FaExclamationCircle /> Low Stock Warning
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PharmacyDashboard;
