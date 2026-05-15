const Patient = require('../../models/Patient');

/**
 * Patient database query module for CRUD operations.
 */
const patientQueries = {
   
    getAllPatients: async () => {
        return await Patient.find().sort({ createdAt: -1 }).populate('assignedDoctor');
    },

    
    registerPatient: async (patientData) => {
        const newPatient = new Patient(patientData);
        return await newPatient.save();
    },

    getPatientsByDoctorAndStatus: async (doctorId, statuses) => {
        return await Patient.find({ 
            assignedDoctor: doctorId, 
            status: { $in: statuses } 
        });
    },

    updateStatus: async (patientId, status) => {
        return await Patient.findByIdAndUpdate(patientId, { status }, { new: true });
    },

    countPatients: async () => {
        return await Patient.countDocuments();
    },

    aggregateByField: async (field) => {
        return await Patient.aggregate([
            { $group: { _id: `$${field}`, count: { $sum: 1 } } }
        ]);
    }
};

module.exports = patientQueries;
