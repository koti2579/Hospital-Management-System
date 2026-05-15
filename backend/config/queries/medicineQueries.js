const Medicine = require('../../models/Medicine');

/**
 * Medicine database query module for CRUD operations.
 */
const medicineQueries = {
    
    getAllInventory: async () => {
        return await Medicine.find().sort({ name: 1 });
    }
};

module.exports = medicineQueries;
