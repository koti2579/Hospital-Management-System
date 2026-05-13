const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'reception', 'doctor', 'pharmacy', 'lab'], required: true },
    name: { type: String, required: true },
    specialization: { type: String }, // For doctors
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
