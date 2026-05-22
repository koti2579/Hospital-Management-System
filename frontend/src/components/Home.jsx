import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./Home.css";
import { Activity } from "lucide-react";
import { FaUserFriends, FaUserMd, FaPills, FaMicroscope } from "react-icons/fa";

const RoleCard = ({ icon, title, onClick }) => {
    return (
        <div className="role-card" onClick={onClick}>
            <div className="role-icon">{icon}</div>
            <h3>{title}</h3>
            <p>Access your dashboard</p>
        </div>
    );
}

const Home = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedRole, setSelectedRole] = useState(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const loginType = params.get('login');
        if (loginType) {
            setSelectedRole(loginType);
        }
    }, [location]);

    const roles = [
        { icon: <FaUserFriends />, title: "Reception", value: "reception" },
        { icon: <FaUserMd />, title: "Doctor", value: "doctor" },
        { icon: <FaPills />, title: "Medical Store", value: "pharmacy" },
        { icon: <FaMicroscope />, title: "Laboratory", value: "laboratory" }
    ];

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        const controller = new AbortController();
        try {
            const apiUrl = process.env.REACT_APP_API_URL || "https://hospital-management-system-23e0.onrender.com/api";
            const res = await axios.post(`${apiUrl}/auth/login`, {
                username,
                password,
                role: selectedRole
            }, { signal: controller.signal });
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            
            // Navigate based on role
            const roleRoutes = {
                admin: "/admin",
                reception: "/reception",
                doctor: "/doctor",
                pharmacy: "/pharmacy",
                laboratory: "/lab"
            };
            navigate(roleRoutes[selectedRole]);
        } catch (err) {
            if (axios.isCancel(err)) return;
            setError(err.response?.data?.message || "Login failed");
        }
    };

    const closeModal = () => {
        setSelectedRole(null);
        setError("");
        setUsername("");
        setPassword("");
        navigate("/", { replace: true });
    };

    return (
        <div className="home-container">
            <div className="top-nav">
                <div className="auth-buttons">
                    <button className="nav-btn admin-btn" onClick={() => navigate("/login?login=admin")}>
                        Admin Login
                    </button>
                </div>
            </div>
            <div className="hero-section">
                <div className="hero-badge">
                    <Activity size={20} />
                    <span>Next-Gen Healthcare Management</span>
                </div>
                <h1>Paperless <span className="highlight">Healthcare</span> Flows Seamlessly.</h1>
                <p className="hero-desc">
                    A unified digital ecosystem connecting patients, doctors, pharmacies, 
                    and laboratories for faster, more accurate medical care.
                </p>
                
                <div className="card-container">
                    {roles.map((role, index) => (
                        <RoleCard
                            key={index}
                            icon={role.icon}
                            title={role.title}
                            onClick={() => setSelectedRole(role.value)}
                        />
                    ))}
                </div>
            </div>

            {selectedRole && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>{selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Login</h2>
                            <button className="close-btn" onClick={closeModal}>&times;</button>
                        </div>
                        <form onSubmit={handleLogin}>
                            <div className="form-group">
                                <label>Username</label>
                                <input 
                                    type="text" 
                                    value={username} 
                                    onChange={(e) => setUsername(e.target.value)} 
                                    placeholder="Enter username" 
                                    required 
                                />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input 
                                    type="password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    placeholder="Enter password" 
                                    required 
                                />
                            </div>
                            {error && <p className="error-msg">{error}</p>}
                            <button type="submit" className="login-submit-btn">Login</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;
