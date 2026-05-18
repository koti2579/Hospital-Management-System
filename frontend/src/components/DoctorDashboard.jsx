import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { 
    FaUserInjured, 
    FaFlask, 
    FaPrescriptionBottleAlt, 
    FaSearch, 
    FaChevronRight, 
    FaCheckCircle, 
    FaClock, 
    FaExclamationCircle,
    FaFileMedicalAlt,
    FaPlus,
    FaTrashAlt,
    FaTimes,
    FaSpinner
} from "react-icons/fa";
import "./Dashboard.css";

const TEST_CATALOG = {
    "Blood Work": [
        "Complete Blood Count (CBC)",
        "Blood Glucose",
        "Lipid Profile",
        "Liver Function Test (LFT)",
        "Kidney Function Test (KFT)",
        "Thyroid Profile (T3, T4, TSH)"
    ],
    "Imaging": [
        "Chest X-Ray",
        "MRI - Brain",
        "CT Scan - Abdomen",
        "Ultrasound - Whole Abdomen",
        "ECG"
    ],
    "Pathology": [
        "Biopsy",
        "Urine Analysis",
        "Sputum Culture",
        "Stool Test"
    ]
};

const DoctorDashboard = () => {
    const apiUrl = process.env.REACT_APP_API_URL || "https://hospital-management-system-23e0.onrender.com/api";
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [labResults, setLabResults] = useState([]);
    const [prescription, setPrescription] = useState({
        medicines: [{ name: "", dosage: "", duration: "" }],
        instructions: ""
    });
    const [selectedTests, setSelectedTests] = useState([]);
    const [testSearch, setTestSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const getUser = () => {
        try {
            const userData = localStorage.getItem("user");
            return (userData && userData !== "undefined") ? JSON.parse(userData) : null;
        } catch (error) {
            console.error("Error parsing user data:", error);
            return null;
        }
    };
    const user = getUser();

    const fetchPatients = useCallback(async (signal) => {
        if (!user?.id) return;
        try {
            const res = await axios.get(`${apiUrl}/doctor/patients/${user.id}`, { signal });
            setPatients(res.data);
        } catch (err) {
            if (axios.isCancel(err)) return;
            console.error("Error fetching patients:", err);
        } finally {
            setLoading(false);
        }
    }, [user?.id, apiUrl]);

    const fetchLabResults = useCallback(async (patientId, signal) => {
        try {
            const res = await axios.get(`${apiUrl}/doctor/patient-results/${patientId}`, { signal });
            setLabResults(res.data);
        } catch (err) {
            if (axios.isCancel(err)) return;
            console.error("Error fetching lab results:", err);
        }
    }, [apiUrl]);

    useEffect(() => {
        const controller = new AbortController();
        fetchPatients(controller.signal);
        return () => controller.abort();
    }, [fetchPatients]);

    useEffect(() => {
        const controller = new AbortController();
        if (selectedPatient && selectedPatient.status === 'ready_for_review') {
            fetchLabResults(selectedPatient._id, controller.signal);
        } else {
            setLabResults([]);
        }
        return () => controller.abort();
    }, [selectedPatient, fetchLabResults]);

    const handleRequestTests = async () => {
        if (selectedTests.length === 0) return;
        try {
            await axios.post(`${apiUrl}/doctor/request-test`, {
                patientId: selectedPatient._id,
                doctorId: user.id,
                tests: selectedTests
            });
            alert("Lab tests requested successfully. Patient is now On Hold.");
            setSelectedTests([]);
            setSelectedPatient(null);
            fetchPatients();
        } catch (err) {
            alert("Error requesting tests");
        }
    };

    const handlePrescribe = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${apiUrl}/doctor/prescribe`, {
                patientId: selectedPatient._id,
                doctorId: user.id,
                medicines: prescription.medicines,
                instructions: prescription.instructions
            });
            alert("Prescription submitted!");
            setSelectedPatient(null);
            setPrescription({ medicines: [{ name: "", dosage: "", duration: "" }], instructions: "" });
            fetchPatients();
        } catch (err) {
            alert("Error submitting prescription");
        }
    };

    const toggleTest = (test) => {
        setSelectedTests(prev => 
            prev.includes(test) ? prev.filter(t => t !== test) : [...prev, test]
        );
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case 'on_hold': return <FaClock className="status-icon amber" />;
            case 'ready_for_review': return <FaExclamationCircle className="status-icon blue" />;
            default: return <FaCheckCircle className="status-icon green" />;
        }
    };

    const formatStatus = (status) => {
        return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    if (loading && patients.length === 0) {
        return (
            <div className="dashboard-loading">
                <FaSpinner className="spinner" />
                <p>Establishing Secure Clinical Environment...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-container doctor-theme">
            <div className="dashboard-header">
                <h1>Clinical Consultation Dashboard</h1>
                <p className="subtitle">Dr. {user?.name} | {user?.specialization}</p>
            </div>

            <div className="doctor-grid">
                {/* Patient Queue */}
                <div className="patient-list glass-card">
                    <div className="section-header">
                        <FaUserInjured />
                        <h2>Patient Queue</h2>
                    </div>
                    <div className="queue-wrapper">
                        {patients.length === 0 ? (
                            <p className="empty-msg">No patients currently in queue.</p>
                        ) : (
                            patients.map(p => (
                                <div 
                                    key={p._id} 
                                    className={`patient-card ${selectedPatient?._id === p._id ? 'active' : ''}`}
                                    onClick={() => setSelectedPatient(p)}
                                >
                                    <div className="patient-info">
                                        <h3>{p.name}</h3>
                                        <p>{p.age}y • {p.gender}</p>
                                    </div>
                                    <div className="patient-status">
                                        {getStatusIcon(p.status)}
                                        <span className={`status-text ${p.status}`}>{formatStatus(p.status)}</span>
                                        <FaChevronRight className="arrow" />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Consultation Area */}
                <div className="consultation-area glass-card">
                    {!selectedPatient ? (
                        <div className="no-selection">
                            <FaFileMedicalAlt size={50} />
                            <p>Select a patient from the queue to start consultation</p>
                        </div>
                    ) : (
                        <div className="active-consultation">
                            <div className="consult-header">
                                <div className="p-header-info">
                                    <h2>Consultation: {selectedPatient.name}</h2>
                                    <div className="vitals-row">
                                        <span>Temp: {selectedPatient.temperature || 'N/A'}°F</span>
                                        <span>Contact: {selectedPatient.contact}</span>
                                    </div>
                                </div>
                                <button className="close-btn" onClick={() => setSelectedPatient(null)}>
                                    <FaTimes />
                                </button>
                            </div>

                            <div className="symptoms-box">
                                <h3>Symptoms / Complaint</h3>
                                <p>{selectedPatient.symptoms || "No symptoms recorded"}</p>
                            </div>

                            {/* Lab Results Review (If ready) */}
                            {selectedPatient.status === 'ready_for_review' && labResults.length > 0 && (
                                <div className="lab-results-section">
                                    <h3><FaFlask /> Lab Test Results</h3>
                                    <div className="results-grid">
                                        {labResults.map(res => (
                                            <div key={res._id} className="result-card">
                                                <span className="test-name">{res.testName}</span>
                                                <p className="test-val">{res.results}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="action-tabs">
                                {/* Lab Test Selection */}
                                <div className="action-card">
                                    <h3><FaFlask /> Request Investigations</h3>
                                    <div className="test-selector">
                                        <div className="search-bar">
                                            <FaSearch />
                                            <input 
                                                type="text" 
                                                placeholder="Search tests..." 
                                                value={testSearch}
                                                onChange={(e) => setTestSearch(e.target.value)}
                                            />
                                        </div>
                                        <div className="test-catalog">
                                            {Object.entries(TEST_CATALOG).map(([category, tests]) => {
                                                const filteredTests = tests.filter(t => t.toLowerCase().includes(testSearch.toLowerCase()));
                                                if (filteredTests.length === 0) return null;
                                                return (
                                                    <div key={category} className="test-category">
                                                        <h4>{category}</h4>
                                                        <div className="test-chips">
                                                            {filteredTests.map(t => (
                                                                <span 
                                                                    key={t} 
                                                                    className={`test-chip ${selectedTests.includes(t) ? 'selected' : ''}`}
                                                                    onClick={() => toggleTest(t)}
                                                                >
                                                                    {t}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        {selectedTests.length > 0 && (
                                            <div className="selected-summary">
                                                <p>{selectedTests.length} tests selected</p>
                                                <button className="request-btn" onClick={handleRequestTests}>
                                                    Send to Laboratory
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Prescription Area (Only if not on hold) */}
                                {selectedPatient.status !== 'on_hold' && (
                                    <div className="action-card">
                                        <h3><FaPrescriptionBottleAlt /> Digital Prescription</h3>
                                        <form onSubmit={handlePrescribe}>
                                            <div className="med-list">
                                                {prescription.medicines.map((m, index) => (
                                                    <div key={index} className="med-row">
                                                        <input 
                                                            placeholder="Medicine Name" 
                                                            value={m.name}
                                                            onChange={(e) => {
                                                                const newMeds = [...prescription.medicines];
                                                                newMeds[index].name = e.target.value;
                                                                setPrescription({...prescription, medicines: newMeds});
                                                            }}
                                                            required
                                                        />
                                                        <input 
                                                            placeholder="Dosage" 
                                                            value={m.dosage}
                                                            onChange={(e) => {
                                                                const newMeds = [...prescription.medicines];
                                                                newMeds[index].dosage = e.target.value;
                                                                setPrescription({...prescription, medicines: newMeds});
                                                            }}
                                                            required
                                                        />
                                                        <input 
                                                            placeholder="Duration" 
                                                            value={m.duration}
                                                            onChange={(e) => {
                                                                const newMeds = [...prescription.medicines];
                                                                newMeds[index].duration = e.target.value;
                                                                setPrescription({...prescription, medicines: newMeds});
                                                            }}
                                                            required
                                                        />
                                                        {index > 0 && (
                                                            <button 
                                                                type="button" 
                                                                className="remove-med"
                                                                onClick={() => {
                                                                    const newMeds = prescription.medicines.filter((_, i) => i !== index);
                                                                    setPrescription({...prescription, medicines: newMeds});
                                                                }}
                                                            >
                                                                <FaTrashAlt />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            <button 
                                                type="button" 
                                                className="add-med-btn"
                                                onClick={() => setPrescription({
                                                    ...prescription, 
                                                    medicines: [...prescription.medicines, { name: "", dosage: "", duration: "" }]
                                                })}
                                            >
                                                <FaPlus /> Add Medicine
                                            </button>
                                            <div className="form-group">
                                                <label>Additional Instructions</label>
                                                <textarea 
                                                    value={prescription.instructions}
                                                    onChange={(e) => setPrescription({...prescription, instructions: e.target.value})}
                                                    rows="2"
                                                />
                                            </div>
                                            <button type="submit" className="submit-btn">
                                                Submit Prescription & Close Case
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
