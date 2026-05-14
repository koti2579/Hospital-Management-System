const LabTest = require('../../models/LabTest');

/**
 * LabTest database query module for CRUD operations.
 */
const labTestQueries = {
    /**
     * Get completed tests for a specific patient.
     * @param {string} patientId 
     * @returns {Promise<Array>}
     */
    getCompletedTestsByPatient: async (patientId) => {
        return await LabTest.find({ patientId, status: 'completed' });
    },

    /**
     * Create multiple lab tests.
     * @param {Array<Object>} tests 
     * @returns {Promise<Array>}
     */
    createMany: async (tests) => {
        return await LabTest.insertMany(tests);
    },

    /**
     * Get all pending tests with populated patient and doctor info.
     * @returns {Promise<Array>}
     */
    getPendingTests: async () => {
        return await LabTest.find({ status: 'pending' })
            .populate('patientId')
            .populate('doctorId');
    },

    /**
     * Update lab test results and status.
     * @param {string} id 
     * @param {string} results 
     * @returns {Promise<Object|null>}
     */
    updateResults: async (id, results) => {
        return await LabTest.findByIdAndUpdate(id, { results, status: 'completed' }, { new: true });
    },

    /**
     * Count pending tests for a patient.
     * @param {string} patientId 
     * @returns {Promise<number>}
     */
    countPendingByPatient: async (patientId) => {
        return await LabTest.countDocuments({ patientId, status: 'pending' });
    }
};

module.exports = labTestQueries;
