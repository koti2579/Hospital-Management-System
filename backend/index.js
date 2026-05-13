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

const app = express();
const PORT = process.env.PORT || 5005;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hms_db';

// Middleware
app.use(cors());
app.use(express.json());

// Auth Routes
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
        res.json({ token, user: { id: user._id, username: user.username, role: user.role, name: user.name } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin Routes
app.get('/api/admin/staff', async (req, res) => {
    try {
        const staff = await User.find({ role: { $ne: 'admin' } });
        res.json(staff);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/admin/stats', async (req, res) => {
    try {
        const totalPatients = await Patient.countDocuments();
        const totalStaff = await User.countDocuments({ role: { $ne: 'admin' } });
        
        // Group by gender
        const genderData = await Patient.aggregate([
            { $group: { _id: "$gender", count: { $sum: 1 } } }
        ]);

        // Group by status
        const statusData = await Patient.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        res.json({
            totalPatients,
            totalStaff,
            genderDistribution: genderData,
            statusDistribution: statusData
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/admin/add-staff', async (req, res) => {
    try {
        const { username, password, role, name, specialization } = req.body;
        const normalizedRole = role === 'laboratory' ? 'lab' : role;
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: 'Username already exists' });
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword, role: normalizedRole, name, specialization });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Reception Routes
app.get('/api/reception/doctors', async (req, res) => {
    try {
        const doctors = await User.find({ role: 'doctor' });
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/reception/patients', async (req, res) => {
    try {
        const patients = await Patient.find().sort({ createdAt: -1 }).populate('assignedDoctor');
        res.json(patients);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/reception/register-patient', async (req, res) => {
    try {
        const newPatient = new Patient(req.body);
        await newPatient.save();
        res.status(201).json(newPatient);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Doctor Routes ---
app.get('/api/doctor/patients/:doctorId', async (req, res) => {
    try {
        const patients = await Patient.find({ 
            assignedDoctor: req.params.doctorId, 
            status: { $in: ['registered', 'on_hold', 'ready_for_review'] } 
        });
        res.json(patients);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/doctor/patient-results/:patientId', async (req, res) => {
    try {
        const tests = await LabTest.find({ patientId: req.params.patientId, status: 'completed' });
        res.json(tests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/doctor/prescribe', async (req, res) => {
    try {
        const { patientId, doctorId, medicines, instructions } = req.body;
        const prescription = new Prescription({ patientId, doctorId, medicines, instructions });
        await prescription.save();
        await Patient.findByIdAndUpdate(patientId, { status: 'consulted' });
        res.status(201).json(prescription);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/doctor/request-test', async (req, res) => {
    try {
        const { patientId, doctorId, tests } = req.body; // 'tests' is now an array of strings
        
        const labTests = tests.map(testName => ({
            patientId,
            doctorId,
            testName
        }));
        
        await LabTest.insertMany(labTests);
        await Patient.findByIdAndUpdate(patientId, { status: 'on_hold' });
        
        res.status(201).json({ message: "Tests requested and patient put on hold" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Pharmacy Routes ---
app.get('/api/pharmacy/inventory', async (req, res) => {
    try {
        const inventory = await Medicine.find().sort({ name: 1 });
        res.json(inventory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/pharmacy/prescriptions', async (req, res) => {
    try {
        const prescriptions = await Prescription.find({ status: 'pending' })
            .populate('patientId')
            .populate('doctorId');
        res.json(prescriptions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/pharmacy/dispense/:id', async (req, res) => {
    try {
        const prescription = await Prescription.findByIdAndUpdate(req.params.id, { status: 'dispensed' }, { new: true });
        await Patient.findByIdAndUpdate(prescription.patientId, { status: 'completed' });
        res.json(prescription);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Lab Routes
app.get('/api/lab/tests', async (req, res) => {
    try {
        const tests = await LabTest.find({ status: 'pending' })
            .populate('patientId')
            .populate('doctorId');
        res.json(tests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/lab/upload/:id', async (req, res) => {
    try {
        const { results } = req.body;
        const test = await LabTest.findByIdAndUpdate(req.params.id, { results, status: 'completed' }, { new: true });
        
        // Check if all tests for this patient are completed
        const pendingTests = await LabTest.countDocuments({ patientId: test.patientId, status: 'pending' });
        if (pendingTests === 0) {
            await Patient.findByIdAndUpdate(test.patientId, { status: 'ready_for_review' });
        }
        
        res.json(test);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Fallback 404
app.use((req, res) => {
    res.status(404).send(`Cannot ${req.method} ${req.url}`);
});

// Database and Server Start
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
    });
