const express = require('express');

const upload = require('../middleware/storage');
const userAuthController = require('../controller/userAuth');
const invesmentController = require('../controller/invesment');
const authRoute = require('../middleware/authRoute');

const InvesmentProperty = require('../schema/InvesmentProperty');

const router = express.Router();

router.get('/signup', userAuthController.getSignup);
router.post('/signup', userAuthController.postSignup);
router.get('/login', userAuthController.getLogin);
router.post('/login', userAuthController.postLogin);
router.get('/logout', userAuthController.logout);

router.get('/', authRoute, invesmentController.home);
router.get('/profile', authRoute, invesmentController.getProfile);
router.post('/profile', invesmentController.postProfile);
router.get('/invesment', authRoute, invesmentController.invesment);
router.get('/accessInvestorPortal', authRoute, invesmentController.accessInvestorPortal);
router.get('/offerSubmission', authRoute, invesmentController.offerSubmission);
router.post('/offerSubmission', invesmentController.postOfferSubmission);
router.post('/newInvesmentEntity', invesmentController.createNewInvestingEntity);
router.get('/documents', authRoute, invesmentController.documents);
router.post('/documents', upload.single('signature'), invesmentController.postDocument);
router.get('/investorVerification', authRoute, invesmentController.investorVerification);
router.post('/investorVerification', authRoute, invesmentController.postInvestorVerification);
router.get('/investorSuitability', authRoute, invesmentController.investorSuitability);
router.get('/myTransactions', authRoute, invesmentController.myTransactions);
router.get('/myDocuments', authRoute, invesmentController.myDocuments);

router.post('/initializeInvesment', async (req, res) => {
    let invesment = new InvesmentProperty({
        name: 'Invesment One',
        minimumInvesment: 6000,
        targetedPropertyCashFlow: 55,
        distribution: 'monthly',
        targetedHoldingPeriod: 10,
        fundSize: 500,
        invesmentStructure: 'google',
        distributions: 'monthly',
        documents: [
            {
                name: 'asda',
                fieldname: 'asdas',
            },
            {
                name: 'asdedasd',
                fieldname: 'asdiyikjsakldj',
            }
        ],
        fundSummary: `sadk ais doiqwo pai spdipq wwidp apsd apwd uo da
                      askjd as doawu do idoas doiqw odao sd dia Adding a backslash at 
                      the end of each line tells the JavaScript engine that the 
                      string will continue to the next line, thus avoiding the 
                      automatic semicolon insertion annoyance. Note that the second 
                      string includes line breaks within the string itself.  
                      Just another nice tip to add to your JavaScript arsenal!`
    });
    await invesment.save();

    invesment = new InvesmentProperty({
        name: 'Invesment Two',
        minimumInvesment: 18000,
        targetedPropertyCashFlow: 188,
        distribution: 'yearly',
        targetedHoldingPeriod: 5,
        fundSize: 500,
        invesmentStructure: 'apple',
        distributions: 'monthly',
        documents: [
            {
                name: 'asda',
                fieldname: 'asdas',
            },
            {
                name: 'asdedasd',
                fieldname: 'asdiyikjsakldj',
            }
        ],
        fundSummary: `Zadk ais doiqdadasda asdaspdipq wwidp apsd apwd uo da
                      askjd as doawu do idoas doiqw odao sd dia Adding a backslash at 
                      the endsad of each line tells thezdfca a JavaScript engine that the 
                      string will continue to the next line, thus avoiding the 
                      automatic semicolon insertion annoyance. Note that the second 
                      string includes lsdine breaks within the string itself.  
                      Just another nice tip to add to your JavaScript arsenal!`
    });
    await invesment.save();

    res.status(200).send('Success');
});

module.exports = router;