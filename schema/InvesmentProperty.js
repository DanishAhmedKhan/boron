const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const invesmentPropertySchema = new Schema({
    name: {
        type: String,
    },
    minimumInvesment: {
        type: Number,
    },
    targetedPropertyCashFlow: {
        type: Number,
    },
    distributions: {
        type: String,
    },
    targetedHoldingPeriod: {
        type: Number,
    },
    fundSize: {
        type: Number
    },
    invesmentStructure: {
        type: String
    },
    documents: [{
        name: String,
        filename: String
    }],
    fundSummary: {
        type: String,
    },
});

const InvesmentProperty = mongoose.model('InvesmentProperty', invesmentPropertySchema);
module.exports = InvesmentProperty;