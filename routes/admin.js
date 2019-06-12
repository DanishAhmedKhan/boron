const express = require('express');

const adminAuthController = require('../controller/adminAuth');

const router = express.Router();

router.get('/adminSignup', adminAuthController.getSignup);
router.post('/adminsSignup', adminAuthController.postSignup);
router.get('/adminLogin', adminAuthController.getLogin);
router.post('/adminLogin', adminAuthController.postLogin);
router.get('/adminLogout', adminAuthController.logout);

module.exports = router;