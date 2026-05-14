import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { 
    FaFlask, 
    FaSpinner, 
    FaMicroscope, 
    FaCheckCircle, 
    FaSearch, 
    FaFilter, 
    FaChartLine,
    FaClipboardCheck,
    FaExclamationTriangle
} from "react-icons/fa";
import "./Dashboard.css";

const LabDashboard = () => {
    const [tests, setTests] = useState([]);
    const [results, setResults] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");

    const fetchTests = useCallback(async (signal) => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get("http://localhost:5000/api/lab/tests", { signal });
            setTests(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            if (axios.isCancel(err)) return;
            console.error("Error fetching tests:", err);
            setError("Failed to load diagnostic investigations.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        fetchTests(controller.signal);

        return () => {
            controller.abort();
        };
    }, [fetchTests]);

    const handleUpload = async (id) => {
        if (!results[id]) {
            alert("Please enter clinical findings before uploading.");
            return;
        }
        try {
            await axios.put(`http://localhost:5000/api/lab/upload/${id}`, {
                results: results[id]
            });
            alert("Diagnostic results uploaded successfully!");
            fetchTests();
        } catch (err) {
            alert("Transmission error. Please try again.");
        }
    };

    const filteredTests = useMemo(() => {
        return tests.filter(t => {
            const matchesSearch = 
                t.patientId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.doctorId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.testName?.toLowerCase().includes(searchTerm.toLowerCase());
            
            if (filterCategory === "all") return matchesSearch;
            return matchesSearch && t.testName.toLowerCase().includes(filterCategory.toLowerCase());
        });
    }, [tests, searchTerm, filterCategory]);

    const stats = useMemo(() => ({
        pending: tests.length,
        critical: tests.filter(t => t.testName.toLowerCase().includes('urgent') || t.testName.toLowerCase().includes('stat')).length,
        totalToday: tests.length // In a real app, this would include completed tests too
    }), [tests]);

    if (loading && tests.length === 0) {
        return (
            <div className="dashboard-loading">
                <FaSpinner className="spinner" />
                <p>Establishing Secure Laboratory Environment...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-container lab-theme">
            <div className="dashboard-header-row">
                <div className="dashboard-header">
                    <h1>Laboratory Analysis Dashboard</h1>
                    <p className="subtitle">High-precision diagnostic management system</p>
                </div>
            </div>

            {error && (
                <div className="error-banner">
                    <FaExclamationTriangle />
                    <span>{error}</span>
                </div>
            )}

            <div className="stats-grid">
                <div className="stat-card blue">
                    <FaFlask />
                    <div className="stat-info">
                        <h3>Active Requests</h3>
                        <p className="stat-value">{stats.pending}</p>
                    </div>
                </div>
                <div className="stat-card amber">
                    <FaExclamationTriangle />
                    <div className="stat-info">
                        <h3>Critical/Stat</h3>
                        <p className="stat-value">{stats.critical}</p>
                    </div>
                </div>
                <div className="stat-card green">
                    <FaClipboardCheck />
                    <div className="stat-info">
                        <h3>Batch Capacity</h3>
                        <p className="stat-value">Optimal</p>
                    </div>
                </div>
            </div>

            <div className="lab-main-grid">
                <div className="filter-sidebar glass-card">
                    <div className="section-header">
                        <FaFilter />
                        <h2>Filters</h2>
                    </div>
                    <div className="filter-group">
                        <label>Global Search</label>
                        <div className="search-input-wrapper">
                            <FaSearch />
                            <input 
                                type="text" 
                                placeholder="Patient, Doctor, or Test..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="filter-group">
                        <label>Diagnostic Category</label>
                        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                            <option value="all">All Investigations</option>
                            <option value="blood">Blood Work</option>
                            <option value="urine">Urine Analysis</option>
                            <option value="imaging">Imaging</option>
                            <option value="culture">Cultures</option>
                        </select>
                    </div>
                    <div className="lab-viz-widget">
                        <h3><FaChartLine /> Productivity</h3>
                        <div className="viz-placeholder">
                            <div className="viz-bar" style={{ height: '60%' }}></div>
                            <div className="viz-bar" style={{ height: '80%' }}></div>
                            <div className="viz-bar" style={{ height: '40%' }}></div>
                            <div className="viz-bar" style={{ height: '90%' }}></div>
                            <div className="viz-bar" style={{ height: '55%' }}></div>
                        </div>
                        <p>Requests processed vs. capacity</p>
                    </div>
                </div>

                <div className="test-list-section glass-card">
                    <div className="section-header">
                        <FaMicroscope />
                        <h2>Diagnostic Investigations Queue</h2>
                        <span className="badge-count">{filteredTests.length} Investigations</span>
                    </div>
                    
                    {filteredTests.length === 0 ? (
                        <div className="empty-state">
                            <FaFlask size={40} style={{ opacity: 0.2, marginBottom: '15px' }} />
                            <p>No investigations match the current filter criteria.</p>
                        </div>
                    ) : (
                        <div className="table-wrapper">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Patient Profile</th>
                                        <th>Referring Doctor</th>
                                        <th>Investigation</th>
                                        <th>Diagnostic Results / Findings</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTests.map(t => (
                                        <tr key={t._id} className="animated-row">
                                            <td>
                                                <div className="p-cell">
                                                    <span className="font-bold">{t.patientId?.name}</span>
                                                    <span className="p-subtext">{t.patientId?.age}y • {t.patientId?.gender}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="d-cell">
                                                    <span>Dr. {t.doctorId?.name}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="test-badge">{t.testName}</span>
                                            </td>
                                            <td>
                                                <textarea 
                                                    className="result-input"
                                                    placeholder="Enter verified findings..." 
                                                    value={results[t._id] || ""} 
                                                    onChange={(e) => setResults({...results, [t._id]: e.target.value})}
                                                />
                                            </td>
                                            <td>
                                                <button className="upload-btn" onClick={() => handleUpload(t._id)}>
                                                    <FaCheckCircle /> Authorize
                                                </button>
                                            </td>
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

export default LabDashboard;
