const Prescription = require('../../models/Prescription');

/**
 * Prescription database query module for CRUD operations.
 */
const prescriptionQueries = {
    
    createPrescription: async (prescriptionData) => {
        const prescription = new Prescription(prescriptionData);
        return await prescription.save();
    },

    
    getPendingPrescriptions: async () => {
        return await Prescription.find({ status: 'pending' })
            .populate('patientId')
            .populate('doctorId');
    },

    dispensePrescription: async (id) => {
        return await Prescription.findByIdAndUpdate(id, { status: 'dispensed' }, { new: true });
    }
};

module.exports = prescriptionQueries;
