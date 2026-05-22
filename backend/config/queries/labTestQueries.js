const LabTest = require('../../models/LabTest');

/**
 * LabTest database query module for CRUD operations.
 */
const labTestQueries = {
    
    getCompletedTestsByPatient: async (patientId) => {
        return await LabTest.find({ patientId, status: 'completed' });
    },

    getAllTestsByPatient: async (patientId) => {
        return await LabTest.find({ patientId })
            .populate('doctorId', 'name');
    },

    createMany: async (tests) => {
        return await LabTest.insertMany(tests);
    },

    getPendingTests: async () => {
        return await LabTest.find({ status: 'pending' })
            .populate('patientId')
            .populate('doctorId');
    },

    updateResults: async (id, results) => {
        return await LabTest.findByIdAndUpdate(id, { results, status: 'completed' }, { new: true });
    },

    countPendingByPatient: async (patientId) => {
        return await LabTest.countDocuments({ patientId, status: 'pending' });
    }
};

module.exports = labTestQueries;
