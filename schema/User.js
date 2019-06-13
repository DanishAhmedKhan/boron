const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');
const InvesmentEntity = require('./InvesmentEntity');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String, 
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profileStatus: {
        type: Number,
    },
    profile: {
        address: String,
        city: String, 
        zip: String,
        country: String,
        state: String,
        phone: String,
        investor: String,
    },
    online: {
        type: Boolean
    },
    invesmentEntity: [{
        _id: false,
        id: { type: ObjectId },
        name: String,
    }],
    invesments: [{
        _id: false,
        invesmentPropertyId: ObjectId,
        userInvesmentId: ObjectId,
        step: Number,
    }]
});

userSchema.methods.generateAuthToken = function() {
    return jwt.sign({ _id: this._id }, config.get('userAuthToken'));
};

const User = mongoose.model('User', userSchema);
module.exports = User;