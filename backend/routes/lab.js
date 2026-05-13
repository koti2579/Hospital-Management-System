const express = require('express');
const router = express.Router();
const LabTest = require('../models/LabTest');

// Get all requested tests
router.get('/tests', async (req, res) => {
    try {
        const tests = await LabTest.find({ status: 'requested' })
            .populate('patient', 'name age gender')
            .populate('doctor', 'name');
        res.json(tests);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Upload test results
router.post('/upload-result/:testId', async (req, res) => {
    try {
        const { result } = req.body;
        await LabTest.findByIdAndUpdate(req.params.testId, { 
            result, 
            status: 'completed' 
        });
        res.json({ message: 'Test results uploaded' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
