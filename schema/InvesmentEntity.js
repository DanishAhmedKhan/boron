const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const invesmentEntitySchema = new Schema({
   investingEntity: {
       accountType: {
           type: String,
       },
       taxId: {
           type: String,
       }
   },
   accountInformation: {
       entityName: {
           type: String,
       },
       accredited: {
            type: String,
       },
   },
   mailingInformation: {
       address: String,
       city: String,
       postalCode: String,
       country: String,
       state: String,
   },
   bankingInformation: {
       paymentMethod: {
           type: String,
       },
       routingABANumber: {
           type: String,
       },
       SWIFTCode: {
           type: String,
       },
       accountNumber: {
           type: String,
       },
       financialInstitutions: {
           type: String,
       },
       fundingNotes: {
           type: String,
       }
   }
});

const InvesmentEntity = mongoose.model('InvesmentEntity', invesmentEntitySchema);
module.exports = InvesmentEntity;