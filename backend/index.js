require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('./models/User');
const Patient = require('./models/Patient');
const Prescription = require('./models/Prescription');
const LabTest = require('./models/LabTest');
const Medicine = require('./models/Medicine');

const connectDB = require('./config/db');

// Route Imports
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const doctorRoutes = require('./routes/doctor');
const labRoutes = require('./routes/lab');
const pharmacyRoutes = require('./routes/pharmacy');
const receptionRoutes = require('./routes/reception');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/lab', labRoutes);
app.use('/api/pharmacy', pharmacyRoutes);
app.use('/api/reception', receptionRoutes);

// Fallback 404
app.use((req, res) => {
    res.status(404).send(`Cannot ${req.method} ${req.url}`);
});

// Server Start
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
