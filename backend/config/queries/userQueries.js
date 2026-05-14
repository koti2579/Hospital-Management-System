const User = require('../../models/User');

/**
 * User database query module for CRUD operations.
 */
const userQueries = {
    /**
     * Find a user by username.
     * @param {string} username 
     * @returns {Promise<Object|null>}
     */
    findByUsername: async (username) => {
        if (!username) throw new Error('Username is required');
        return await User.findOne({ username });
    },

    /**
     * Get all staff members (non-admin users).
     * @returns {Promise<Array>}
     */
    getAllStaff: async () => {
        return await User.find({ role: { $ne: 'admin' } });
    },

    /**
     * Get all doctors.
     * @returns {Promise<Array>}
     */
    getAllDoctors: async () => {
        return await User.find({ role: 'doctor' });
    },

    /**
     * Count staff members excluding admin.
     * @returns {Promise<number>}
     */
    countStaff: async () => {
        return await User.countDocuments({ role: { $ne: 'admin' } });
    },

    /**
     * Create a new user.
     * @param {Object} userData 
     * @returns {Promise<Object>}
     */
    createUser: async (userData) => {
        const newUser = new User(userData);
        return await newUser.save();
    }
};

module.exports = userQueries;
