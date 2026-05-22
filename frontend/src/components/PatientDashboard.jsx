import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";
import { User, FileText, Activity, LogOut, Calendar, Phone, Baby } from "lucide-react";

const PatientDashboard = () => {
    const [patient, setPatient] = useState(null);
    const [prescriptions, setPrescriptions] = useState([]);
    const [labTests, setLabTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("patientToken");
                const config = {
                    withCredentials: true,
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                };
                const [profileRes, prescriptionRes, labRes] = await Promise.all([
                    axios.get(`${apiUrl}/patient/profile`, config),
                    axios.get(`${apiUrl}/patient/prescriptions`, config),
                    axios.get(`${apiUrl}/patient/lab-tests`, config)
                ]);

                setPatient(profileRes.data);
                setPrescriptions(prescriptionRes.data);
                setLabTests(labRes.data);
            } catch (err) {
                console.error("Error fetching patient data:", err);
                setError("Session expired or unauthorized. Please login again.");
                setTimeout(() => navigate("/patient-login"), 3000);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [apiUrl, navigate]);

    const handleLogout = () => {
        localStorage.removeItem("patient");
        localStorage.removeItem("patientToken");
        navigate("/");
    };

    if (loading) return (
        <div className="portal-loading">
            <Activity className="spin-slow" />
            <p>Loading your medical records...</p>
        </div>
    );
    
    if (error) return (
        <div className="portal-error">
            <p>{error}</p>
            <button onClick={() => navigate("/patient-login")}>Go to Login</button>
        </div>
    );

    return (
        <div className="patient-portal-wrapper">
            <header className="portal-top-header">
                <h1>Patient Portal</h1>
                <button className="portal-logout-btn" onClick={handleLogout}>
                    <LogOut size={16} />
                    Logout
                </button>
            </header>

            <div className="portal-content-layout">
                {/* Left Column: Personal Information Card */}
                <aside className="portal-column-left">
                    <section className="portal-card info-card">
                        <div className="card-title-row">
                            <div className="icon-circle green">
                                <User size={20} />
                            </div>
                            <h2>Personal Information</h2>
                        </div>
                        <div className="divider" />
                        
                        <div className="info-items-list">
                            <div className="info-item">
                                <User size={18} className="item-icon" />
                                <div className="item-content">
                                    <label>Full Name</label>
                                    <span>{patient.name}</span>
                                </div>
                            </div>
                            
                            <div className="info-item">
                                <Calendar size={18} className="item-icon" />
                                <div className="item-content">
                                    <label>Date of Birth</label>
                                    <span>{new Date(patient.dateOfBirth).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="info-item">
                                <Phone size={18} className="item-icon" />
                                <div className="item-content">
                                    <label>Phone Number</label>
                                    <span>{patient.phoneNumber}</span>
                                </div>
                            </div>

                            <div className="info-item">
                                <Baby size={18} className="item-icon" />
                                <div className="item-content">
                                    <label>Gender</label>
                                    <span>{patient.gender}</span>
                                </div>
                            </div>

                            <div className="info-item">
                                <User size={18} className="item-icon" />
                                <div className="item-content">
                                    <label>Assigned Doctor</label>
                                    <span>Dr. {patient.assignedDoctor?.name || 'Not assigned'}</span>
                                </div>
                            </div>
                        </div>
                    </section>
                </aside>

                {/* Right Column: Records Cards */}
                <main className="portal-column-right">
                    {/* My Prescriptions Card */}
                    <section className="portal-card records-card">
                        <div className="card-title-row">
                            <div className="icon-circle green">
                                <FileText size={20} />
                            </div>
                            <h2>My Prescriptions</h2>
                        </div>
                        <div className="divider" />
                        
                        {prescriptions.length === 0 ? (
                            <div className="empty-records">
                                <FileText size={40} />
                                <p>No prescriptions found.</p>
                            </div>
                        ) : (
                            <div className="records-table-container">
                                <table className="portal-table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Doctor</th>
                                            <th>Medicines</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {prescriptions.map((pres) => (
                                            <tr key={pres._id}>
                                                <td>{new Date(pres.createdAt).toLocaleDateString()}</td>
                                                <td>{pres.doctorId?.name}</td>
                                                <td>
                                                    <ul className="medicines-bullet-list">
                                                        {pres.medicines.map((med, i) => (
                                                            <li key={i}>{med.name} - {med.dosage} ({med.frequency})</li>
                                                        ))}
                                                    </ul>
                                                </td>
                                                <td>
                                                    <span className={`status-pill-badge ${pres.status}`}>
                                                        {pres.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>

                    {/* Lab Test Reports Card */}
                    <section className="portal-card records-card">
                        <div className="card-title-row">
                            <div className="icon-circle green">
                                <Activity size={20} />
                            </div>
                            <h2>Lab Test Reports</h2>
                        </div>
                        <div className="divider" />
                        
                        {labTests.length === 0 ? (
                            <div className="empty-lab-state">
                                <FileText size={48} className="empty-icon" />
                                <h3>No lab test reports available.</h3>
                                <p>Your lab test reports will appear here when available.</p>
                            </div>
                        ) : (
                            <div className="records-table-container">
                                <table className="portal-table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Test Name</th>
                                            <th>Doctor</th>
                                            <th>Status</th>
                                            <th>Results</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {labTests.map((test) => (
                                            <tr key={test._id}>
                                                <td>{new Date(test.createdAt).toLocaleDateString()}</td>
                                                <td>{test.testName}</td>
                                                <td>{test.doctorId?.name}</td>
                                                <td>
                                                    <span className={`status-pill-badge ${test.status}`}>
                                                        {test.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    {test.results ? (
                                                        <div className="result-text-preview">{test.results}</div>
                                                    ) : (
                                                        <span className="pending-indicator">Pending</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
};

export default PatientDashboard;
