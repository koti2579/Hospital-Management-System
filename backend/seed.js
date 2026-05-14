require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Medicine = require('./models/Medicine');

const seedUsers = async () => {
    try {
        await connectDB();
        console.log('Connected to MongoDB for seeding...');

        // Clear existing users and medicines
        await User.deleteMany({});
        await Medicine.deleteMany({});

        const medicines = [
            { name: 'Paracetamol 500mg', category: 'Tablet', stock: 150, unit: 'strips', minThreshold: 20 },
            { name: 'Amoxicillin 250mg', category: 'Capsule', stock: 5, unit: 'strips', minThreshold: 15 },
            { name: 'Cough Relief Syrup', category: 'Syrup', stock: 45, unit: 'bottles', minThreshold: 10 },
            { name: 'Insulin Glargine', category: 'Injection', stock: 12, unit: 'vials', minThreshold: 5 },
            { name: 'Betadine Ointment', category: 'Ointment', stock: 30, unit: 'tubes', minThreshold: 10 },
            { name: 'Vitamin C 1000mg', category: 'Tablet', stock: 200, unit: 'strips', minThreshold: 50 },
            { name: 'Aspirin 75mg', category: 'Tablet', stock: 8, unit: 'strips', minThreshold: 20 },
            { name: 'Cetirizine 10mg', category: 'Tablet', stock: 85, unit: 'strips', minThreshold: 15 }
        ];

        await Medicine.insertMany(medicines);
        console.log('Medicines seeded!');

        const users = [
            {
                username: 'admin',
                password: 'admin123',
                role: 'admin',
                name: 'System Admin'
            },
            {
                username: 'reception',
                password: 'reception123',
                role: 'reception',
                name: 'John Doe'
            },
            {
                username: 'doctor1',
                password: 'doctor123',
                role: 'doctor',
                name: 'Smith',
                specialization: 'Cardiologist'
            },
            {
                username: 'pharmacy',
                password: 'pharmacy123',
                role: 'pharmacy',
                name: 'Medical Store'
            },
            {
                username: 'lab',
                password: 'lab123',
                role: 'lab',
                name: 'Lab Tech'
            }
        ];

        for (let user of users) {
            user.password = await bcrypt.hash(user.password, 10);
            const newUser = new User(user);
            await newUser.save();
        }

        console.log('Database seeded successfully!');
        process.exit();
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seedUsers();
