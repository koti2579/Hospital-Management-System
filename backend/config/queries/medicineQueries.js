const Medicine = require('../../models/Medicine');

/**
 * Medicine database query module for CRUD operations.
 */
const medicineQueries = {
    /**
     * Get all medicine inventory sorted by name.
     * @returns {Promise<Array>}
     */
    getAllInventory: async () => {
        return await Medicine.find().sort({ name: 1 });
    }
};

module.exports = medicineQueries;
