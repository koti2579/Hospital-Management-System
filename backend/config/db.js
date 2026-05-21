const mongoose = require('mongoose');


const connectDB = async () => {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/hms_db';
    
    // Mask URI for safe logging
    const maskedURI = MONGO_URI.replace(/\/\/.*@/, '//****:****@');
    console.log(`Attempting to connect to: ${maskedURI}`);

    const options = {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4
    };

    try {
        await mongoose.connect(MONGO_URI, options);
        console.log(`MongoDB Connected: ${mongoose.connection.host}`);
    } catch (err) {
        console.error('--- MongoDB Connection Failure ---');
        console.error(`Error Type: ${err.name}`);
        console.error(`Message: ${err.message}`);
        
        if (err.message.includes('authentication failed')) {
            console.error('DIAGNOSIS: The username or password in your MONGO_URI is incorrect.');
            console.error('ACTION: Please verify your Database User credentials in MongoDB Atlas and update Render Environment Variables.');
        }
        
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
    }
};

module.exports = connectDB;
