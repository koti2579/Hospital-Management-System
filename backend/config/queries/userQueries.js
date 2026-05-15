const User = require('../../models/User');

/**
 * User database query module for CRUD operations.
 */
const userQueries = {
   
    findByUsername: async (username) => {
        if (!username) throw new Error('Username is required');
        return await User.findOne({ username });
    },

    getAllStaff: async () => {
        return await User.find({ role: { $ne: 'admin' } });
    },

    getAllDoctors: async () => {
        return await User.find({ role: 'doctor' });
    },

    
    countStaff: async () => {
        return await User.countDocuments({ role: { $ne: 'admin' } });
    },

    createUser: async (userData) => {
        const newUser = new User(userData);
        return await newUser.save();
    }
};

module.exports = userQueries;
