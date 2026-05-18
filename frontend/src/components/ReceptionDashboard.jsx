import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
    FaUserPlus, 
    FaSpinner, 
    FaExclamationTriangle, 
    FaUsers, 
    FaClock, 
    FaCheckCircle,
    FaStethoscope,
    FaNotesMedical
} from "react-icons/fa";
import "./Dashboard.css";

const ReceptionDashboard = () => {
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL || "https://hospital-management-system-23e0.onrender.com/api";
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        age: "",
        gender: "Male",
        contact: "",
        temperature: "",
        symptoms: "",
        assignedDoctor: ""
    });
    const [actionMessage, setActionMessage] = useState({ text: "", type: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Check for reception permissions
    useEffect(() => {
        try {
            const userData = localStorage.getItem("user");
            const user = (userData && userData !== "undefined") ? JSON.parse(userData) : null;
            if (!user || user.role !== 'reception') {
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
            const [doctorsRes, patientsRes] = await Promise.all([
                axios.get(`${apiUrl}/reception/doctors`, { signal }),
                axios.get(`${apiUrl}/reception/patients`, { signal })
            ]);
            
            const doctorList = Array.isArray(doctorsRes.data) ? doctorsRes.data : [];
            setDoctors(doctorList);
            setPatients(Array.isArray(patientsRes.data) ? patientsRes.data : []);
            
            if (doctorList.length > 0 && !formData.assignedDoctor) {
                setFormData(prev => ({ ...prev, assignedDoctor: doctorList[0]._id }));
            }
        } catch (err) {
            if (axios.isCancel(err)) return;
            console.error("Error fetching data", err);
            setError("Connectivity issue detected. Please verify your backend server.");
        } finally {
            setLoading(false);
        }
    }, [formData.assignedDoctor, apiUrl]);

    useEffect(() => {
        const controller = new AbortController();
        fetchData(controller.signal);
        return () => controller.abort();
    }, [fetchData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.assignedDoctor) {
            setActionMessage({ text: "Assign a consultant to proceed", type: "error" });
            return;
        }
        
        setIsSubmitting(true);
        setActionMessage({ text: "", type: "" });
        
        try {
            await axios.post(`${apiUrl}/reception/register-patient`, formData);
            setActionMessage({ text: "Patient profile synchronized successfully!", type: "success" });
            setFormData({
                name: "",
                age: "",
                gender: "Male",
                contact: "",
                temperature: "",
                symptoms: "",
                assignedDoctor: doctors[0]?._id || ""
            });
            fetchData(); // Refresh list
        } catch (err) {
            setActionMessage({ text: "Transmission error. Please attempt registration again.", type: "error" });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading && patients.length === 0) {
        return (
            <div className="dashboard-loading">
                <FaSpinner className="spinner" />
                <p>Establishing Secure Reception Interface...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-container reception-theme">
            <div className="dashboard-header">
                <h1>Reception Control Panel</h1>
                <p className="subtitle">Managing patient admissions and clinical workflow routing</p>
            </div>

            {error && (
                <div className="error-banner">
                    <FaExclamationTriangle />
                    <span>{error}</span>
                    <button onClick={fetchData}>Synchronize System</button>
                </div>
            )}

            <div className="reception-split-grid">
                {/* Left: Registration Section */}
                <div className="registration-section glass-card">
                    <div className="section-header">
                        <FaUserPlus />
                        <h2>Patient Admission</h2>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="admission-form">
                        <div className="form-group">
                            <label>Patient Full Name</label>
                            <input 
                                type="text" 
                                placeholder="Legal name as per ID" 
                                value={formData.name} 
                                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                                required 
                            />
                        </div>
                        
                        <div className="form-row">
                            <div className="form-group">
                                <label>Age</label>
                                <input 
                                    type="number" 
                                    placeholder="Years" 
                                    value={formData.age} 
                                    onChange={(e) => setFormData({...formData, age: e.target.value})} 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label>Gender</label>
                                <select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Contact Number</label>
                                <input 
                                    type="text" 
                                    placeholder="Phone/Mobile" 
                                    value={formData.contact} 
                                    onChange={(e) => setFormData({...formData, contact: e.target.value})} 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label>Vitals (Temp °F)</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. 98.6" 
                                    value={formData.temperature} 
                                    onChange={(e) => setFormData({...formData, temperature: e.target.value})} 
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Assign Clinical Consultant</label>
                            <select 
                                value={formData.assignedDoctor} 
                                onChange={(e) => setFormData({...formData, assignedDoctor: e.target.value})} 
                                required
                            >
                                <option value="" disabled>Select on-duty doctor</option>
                                {doctors.map(d => (
                                    <option key={d._id} value={d._id}>Dr. {d.name} ({d.specialization})</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Primary Symptoms / Reason for Visit</label>
                            <textarea 
                                placeholder="Patient reported issues..." 
                                value={formData.symptoms} 
                                onChange={(e) => setFormData({...formData, symptoms: e.target.value})} 
                                rows="3"
                            />
                        </div>
                        
                        <button type="submit" className="submit-btn register-btn" disabled={isSubmitting}>
                            {isSubmitting ? "Synchronizing..." : "Finalize Admission"}
                        </button>
                        
                        {actionMessage.text && (
                            <p className={`message ${actionMessage.type}`}>
                                {actionMessage.text}
                            </p>
                        )}
                    </form>
                </div>

                {/* Right: Workflow Section */}
                <div className="workflow-section glass-card">
                    <div className="section-header">
                        <FaUsers />
                        <h2>Clinical Workflow Status</h2>
                    </div>

                    <div className="patient-workflow-list">
                        {patients.length === 0 ? (
                            <div className="empty-state">
                                <FaNotesMedical size={40} style={{ opacity: 0.2, marginBottom: '15px' }} />
                                <p>No active patients in the current cycle.</p>
                            </div>
                        ) : (
                            patients.map((p) => (
                                <div key={p._id} className="workflow-card">
                                    <div className="workflow-card-left">
                                        <div className="patient-avatar">
                                            {p.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="patient-meta">
                                            <h3>{p.name}</h3>
                                            <p>{p.age}y • {p.gender}</p>
                                        </div>
                                    </div>
                                    <div className="workflow-card-right">
                                        <div className="workflow-step">
                                            <FaStethoscope className="step-icon" />
                                            <div className="step-info">
                                                <span className="step-label">Consultant</span>
                                                <span className="step-value">Dr. {p.assignedDoctor?.name || 'Unassigned'}</span>
                                            </div>
                                        </div>
                                        <div className={`status-pill ${p.status}`}>
                                            {p.status === 'registered' && <FaClock />}
                                            {p.status === 'consulted' && <FaSpinner className="spin-slow" />}
                                            {p.status === 'completed' && <FaCheckCircle />}
                                            {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReceptionDashboard;
