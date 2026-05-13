const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    category: { type: String, enum: ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Ointment', 'Other'], default: 'Tablet' },
    stock: { type: Number, required: true, default: 0 },
    unit: { type: String, default: 'pcs' }, // e.g., 'bottles', 'strips'
    minThreshold: { type: Number, default: 10 } // For low stock alerts
}, { timestamps: true });

module.exports = mongoose.model('Medicine', MedicineSchema);
