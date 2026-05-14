const express = require('express');
const router = express.Router();
const prescriptionQueries = require('../config/queries/prescriptionQueries');

const medicineQueries = require('../config/queries/medicineQueries');
const patientQueries = require('../config/queries/patientQueries');

// Get pharmacy inventory
router.get('/inventory', async (req, res) => {
    try {
        const inventory = await medicineQueries.getAllInventory();
        res.json(inventory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all pending prescriptions
router.get('/prescriptions', async (req, res) => {
    try {
        const prescriptions = await prescriptionQueries.getPendingPrescriptions();
        res.json(prescriptions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Issue medicines
router.put('/dispense/:id', async (req, res) => {
    try {
        const prescription = await prescriptionQueries.dispensePrescription(req.params.id);
        await patientQueries.updateStatus(prescription.patientId, 'completed');
        res.json(prescription);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
