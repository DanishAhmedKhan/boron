const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userInvesmentSchema = new Schema({
    invesmentProperty: {
        name: String,
    },
    invesmentCommited: {
        type: Number,
    },
    phoneNumber: {
        type: String,
    },
    investingEntity: {
        type: String,
    },
    investorVerification: {
        firstName: String,
        middleName: String,
        lastName: String,
        dob: String,
        primaryNumber: String,
        code: String,
        residencyStatus: String,
        address: String,
        city: String,
        country: String,
        postalCode: String,
        state: String,
        employmentStatus: String,
        annualIncome: String,
        netWorth: String,
        stockBrolker: String,
    }
});

const UserInvesment = mongoose.model('UserInvesment', userInvesmentSchema);
module.exports = UserInvesment;