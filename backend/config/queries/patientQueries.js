const Patient = require('../../models/Patient');

/**
 * Patient database query module for CRUD operations.
 */
const patientQueries = {
    /**
     * Get all patients sorted by creation date.
     * @returns {Promise<Array>}
     */
    getAllPatients: async () => {
        return await Patient.find().sort({ createdAt: -1 }).populate('assignedDoctor');
    },

    /**
     * Register a new patient.
     * @param {Object} patientData 
     * @returns {Promise<Object>}
     */
    registerPatient: async (patientData) => {
        const newPatient = new Patient(patientData);
        return await newPatient.save();
    },

    /**
     * Get patients assigned to a specific doctor with specific statuses.
     * @param {string} doctorId 
     * @param {Array<string>} statuses 
     * @returns {Promise<Array>}
     */
    getPatientsByDoctorAndStatus: async (doctorId, statuses) => {
        return await Patient.find({ 
            assignedDoctor: doctorId, 
            status: { $in: statuses } 
        });
    },

    /**
     * Update patient status.
     * @param {string} patientId 
     * @param {string} status 
     * @returns {Promise<Object|null>}
     */
    updateStatus: async (patientId, status) => {
        return await Patient.findByIdAndUpdate(patientId, { status }, { new: true });
    },

    /**
     * Count total patients.
     * @returns {Promise<number>}
     */
    countPatients: async () => {
        return await Patient.countDocuments();
    },

    /**
     * Aggregate patients by a specific field.
     * @param {string} field 
     * @returns {Promise<Array>}
     */
    aggregateByField: async (field) => {
        return await Patient.aggregate([
            { $group: { _id: `$${field}`, count: { $sum: 1 } } }
        ]);
    }
};

module.exports = patientQueries;
