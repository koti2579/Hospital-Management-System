const mongoose = require('mongoose');

/**
 * Establish a secure, persistent connection to MongoDB with connection pooling.
 * @returns {Promise<void>}
 */
const connectDB = async () => {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hms_db';
    
    // Connection options for pooling and performance
    const options = {
        maxPoolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        family: 4 // Use IPv4, skip trying IPv6
    };

    try {
        await mongoose.connect(MONGO_URI, options);
        console.log(`MongoDB Connected: ${mongoose.connection.host} (${process.env.NODE_ENV || 'development'} mode)`);
    } catch (err) {
        console.error(`MongoDB Connection Error: ${err.message}`);
        // Exit process with failure if connection is critical
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
    }
};

module.exports = connectDB;
