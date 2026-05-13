const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    contact: { type: String, required: true },
    temperature: { type: String },
    symptoms: { type: String },
    assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['registered', 'on_hold', 'ready_for_review', 'consulted', 'completed'], default: 'registered' }
}, { timestamps: true });

module.exports = mongoose.model('Patient', PatientSchema);
