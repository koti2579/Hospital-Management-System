const mongoose = require('mongoose');

const PrescriptionSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    medicines: [{
        name: { type: String, required: true },
        dosage: { type: String, required: true },
        duration: { type: String, required: true }
    }],
    instructions: { type: String },
    status: { type: String, enum: ['pending', 'dispensed'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Prescription', PrescriptionSchema);
