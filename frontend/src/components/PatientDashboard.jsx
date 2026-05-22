import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";
import { User, FileText, Activity, LogOut } from "lucide-react";

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

    if (loading) return <div className="loading">Loading your medical records...</div>;
    if (error) return <div className="error-container">{error}</div>;

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="header-left">
                    <Activity className="header-icon" />
                    <h1>Patient Portal</h1>
                </div>
                <button className="logout-btn" onClick={handleLogout}>
                    <LogOut size={20} />
                    Logout
                </button>
            </header>

            <main className="dashboard-main">
                {/* Profile Section */}
                <section className="dashboard-section profile-section">
                    <div className="section-header">
                        <User className="section-icon" />
                        <h2>Personal Information</h2>
                    </div>
                    <div className="profile-grid">
                        <div className="profile-item">
                            <label>Full Name</label>
                            <p>{patient.name}</p>
                        </div>
                        <div className="profile-item">
                            <label>Date of Birth</label>
                            <p>{new Date(patient.dateOfBirth).toLocaleDateString()}</p>
                        </div>
                        <div className="profile-item">
                            <label>Phone Number</label>
                            <p>{patient.phoneNumber}</p>
                        </div>
                        <div className="profile-item">
                            <label>Gender</label>
                            <p>{patient.gender}</p>
                        </div>
                        {patient.careTeam && (
                            <div className="profile-item">
                                <label>Care Team</label>
                                <p>{patient.careTeam}</p>
                            </div>
                        )}
                        <div className="profile-item">
                            <label>Assigned Doctor</label>
                            <p>{patient.assignedDoctor?.name || 'Not assigned'}</p>
                        </div>
                    </div>
                </section>

                {/* Prescriptions Section */}
                <section className="dashboard-section">
                    <div className="section-header">
                        <FileText className="section-icon" />
                        <h2>My Prescriptions</h2>
                    </div>
                    {prescriptions.length === 0 ? (
                        <p className="no-data">No prescriptions found.</p>
                    ) : (
                        <div className="data-table-container">
                            <table className="data-table">
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
                                                <ul className="med-list">
                                                    {pres.medicines.map((med, i) => (
                                                        <li key={i}>{med.name} - {med.dosage} ({med.frequency})</li>
                                                    ))}
                                                </ul>
                                            </td>
                                            <td><span className={`status-badge ${pres.status}`}>{pres.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                {/* Lab Tests Section */}
                <section className="dashboard-section">
                    <div className="section-header">
                        <Activity className="section-icon" />
                        <h2>Lab Test Reports</h2>
                    </div>
                    {labTests.length === 0 ? (
                        <p className="no-data">No lab tests found.</p>
                    ) : (
                        <div className="data-table-container">
                            <table className="data-table">
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
                                            <td><span className={`status-badge ${test.status}`}>{test.status}</span></td>
                                            <td>
                                                {test.results ? (
                                                    <div className="results-text">{test.results}</div>
                                                ) : (
                                                    <span className="pending-text">Results Pending</span>
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
    );
};

export default PatientDashboard;
