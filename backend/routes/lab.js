const express = require('express');
const router = express.Router();
const labTestQueries = require('../config/queries/labTestQueries');

const patientQueries = require('../config/queries/patientQueries');

// Get all requested tests
router.get('/tests', async (req, res) => {
    try {
        const tests = await labTestQueries.getPendingTests();
        res.json(tests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Upload test results
router.put('/upload/:id', async (req, res) => {
    try {
        const { results } = req.body;
        const test = await labTestQueries.updateResults(req.params.id, results);
        
        // Check if all tests for this patient are completed
        const pendingTests = await labTestQueries.countPendingByPatient(test.patientId);
        if (pendingTests === 0) {
            await patientQueries.updateStatus(test.patientId, 'ready_for_review');
        }
        
        res.json(test);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
