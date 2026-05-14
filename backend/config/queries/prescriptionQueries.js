const Prescription = require('../../models/Prescription');

/**
 * Prescription database query module for CRUD operations.
 */
const prescriptionQueries = {
    /**
     * Create a new prescription.
     * @param {Object} prescriptionData 
     * @returns {Promise<Object>}
     */
    createPrescription: async (prescriptionData) => {
        const prescription = new Prescription(prescriptionData);
        return await prescription.save();
    },

    /**
     * Get pending prescriptions with populated patient and doctor info.
     * @returns {Promise<Array>}
     */
    getPendingPrescriptions: async () => {
        return await Prescription.find({ status: 'pending' })
            .populate('patientId')
            .populate('doctorId');
    },

    /**
     * Dispense a prescription by updating its status.
     * @param {string} id 
     * @returns {Promise<Object|null>}
     */
    dispensePrescription: async (id) => {
        return await Prescription.findByIdAndUpdate(id, { status: 'dispensed' }, { new: true });
    }
};

module.exports = prescriptionQueries;
