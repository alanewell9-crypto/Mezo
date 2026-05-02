const mongoose = require('mongoose');

// Customer schema
const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    address: String,
    phone: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Vendor schema
const vendorSchema = new mongoose.Schema({
    businessName: {
        type: String,
        required: true,
    },
    contactPerson: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    address: String,
    phone: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Customer = mongoose.model('Customer', customerSchema);
const Vendor = mongoose.model('Vendor', vendorSchema);

module.exports = { Customer, Vendor };