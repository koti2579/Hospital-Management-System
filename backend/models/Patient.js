const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true, index: true },
    contact: { type: String }, // Optional alternative contact
    temperature: { type: String },
    symptoms: { type: String },
    assignedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    careTeam: { type: String },
    medicalMetadata: { type: Map, of: String },
    status: { type: String, enum: ['registered', 'on_hold', 'ready_for_review', 'consulted', 'completed'], default: 'registered' }
}, { timestamps: true });

module.exports = mongoose.model('Patient', PatientSchema);
