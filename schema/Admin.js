const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const adminSchema = new Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    }
});

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;