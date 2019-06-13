const Joi = require('joi');
const __ = require('./util');
const mailer = require('nodemailer');
const User = require('../schema/User');
const InvesmentProperty = require('../schema/InvesmentProperty');
const InvesmentEntity = require('../schema/InvesmentEntity');
const UserInvesment = require('../schema/UserInvesment');

exports.home = async (req, res) => {
    await User.updateOne({ _id: req.session.user._id }, {
        $set: { profileStatus: 3 }
    });

    const invesments = await InvesmentProperty.find({});

    res.render('user/index', {
        pageTitle: 'Boron Invesment',
        isAuthenticated: req.session.isLoggedIn,
        invesments: invesments,
    });
};

exports.getProfile = async (req, res) => {
    res.render('user/setup-profile', {
        pageTitle: 'Complete your profile',
        isAuthenticated: req.session.isLoggedIn,
        user: req.session.user,
    });
};

exports.postProfile = async (req, res) => {
    console.log(req.body);

    const error = __.validate(req.body, {
        _id: Joi.string().required(),
        address: Joi.string().required(),
        city: Joi.string().required(),
        zip: Joi.string().required(),
        country: Joi.string().required(),
        state: Joi.string().required(),
        phone: Joi.string().required(),
    });
    if (error) {
        req.flash('error', error.details[0].message);
        return res.redirect('/profile');
    }

    const profile = {
        address: req.body.address,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        state: req.body.state,
        phone: req.body.phone,
    };

    await User.update({ _id: req.body._id }, {
        $set: { profile: profile, profileStatus: 2 }
    });

    res.redirect('/accessInvestorPortal');
};

exports.accessInvestorPortal = async (req, res) => {
    res.render('user/accessInvestorPortal', {
        pageTitle: 'Access Investor Portal',
        isAuthenticated: req.session.isLoggedIn,
    });
};

exports.invesment = async (req, res) => {
    const invesment = await InvesmentProperty.findOne({ _id: req.query.id });

    req.session.invesmentPropertyId = req.query.id;
    req.session.invesmentPropertyName = invesment.name;
    req.session.save(err => {
        if (err) return console.log(err);
    });

    const check = await User.findOne({
        _id: req.session.user._id, 
        'invesments.invesmentPropertyId': req.query.id,
    }, { _id: 0, invesments: { $elemMatch: { invesmentPropertyId: req.query.id } } });

    if (check != null) {
        var step = check.invesments[0].step, reviewLink;
        if (step == 1) {
            reviewLink = '/investorVerification';
        } else if (step == 2) {
            reviewLink = '/documents';
        }
    }

    res.render('user/invesment', {
        pageTitle: 'Invesment',
        isAuthenticated: req.session.isLoggedIn,
        invesment: invesment,
        hasUserInvested: (check != null),
        reviewLink,
    });
};

exports.offerSubmission = async (req, res) => {
    let error = req.flash('error');
    if (error.length > 0) error = error[0];
    else error = null;

    const invesment = await InvesmentProperty.findOne({ _id: req.session.invesmentPropertyId });
    const { invesmentEntity } = await User.findOne({ _id: req.session.user._id },
        'invesmentEntity');

    res.render('user/offerSubmission', {
        pageTitle: 'Offer Submission',
        isAuthenticated: req.session.isLoggedIn,
        invesmentId: invesment._id,
        invesmentName: invesment.name,
        userId: req.session.user._id,
        userEntity: invesmentEntity,
        error: error,
    });
}; 

exports.postOfferSubmission = async (req, res) => {
    const error = __.validate(req.body, {
        invesmentCommited: Joi.number().min(6000).required(),
        phoneNumber: Joi.string().required(),
        investingEntity: Joi.string().required(),
    });
    if (error) {
        console.log(error.details[0].message);
        req.flash('error', error.details[0].message);
        return res.redirect('/offerSubmission');
    }

    let userInvesment = new UserInvesment({
        invesmentProperty: { name: req.session.invesmentPropertyName },
        invesmentCommited: req.body.invesmentCommited,
        phoneNumber: req.body.phoneNumber,
        investingEntity: req.body.investingEntity,
    });
    userInvesment.save();

    await User.updateOne({ _id: req.session.user._id }, {
        $push: {
            invesments: {
                invesmentPropertyId: req.session.invesmentPropertyId,
                userInvesmentId: userInvesment._id,
                step: 1,
            }
        },
    });

    req.session.userInvesmentId = userInvesment._id;
    req.session.save(err => {
        if (err) return console.log(err);
    });

    res.redirect('/investorVerification');
};

exports.createNewInvestingEntity = async (req, res) => {
    const error = __.validate(req.body, {
        userId: Joi.string().required(),
        invesmentId: Joi.string().required(),
        accountType: Joi.string().required(),
        taxId: Joi.string().required(),
        entityName: Joi.string().required(),
        accredited: Joi.string().required(),
        address: Joi.string().required(),
        city: Joi.string().required(),
        postalCode: Joi.string().required(),
        country: Joi.string().required(),
        state: Joi.string().required(),
        paymentMethod: Joi.string().required(),
        routingABANumber: Joi.string().required(),
        SWIFTCode: Joi.string().required(),
        accountNumber: Joi.string().required(),
        financialInstitutions: Joi.string().required(),
        fundingNotes: Joi.string().required(),
    });
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const invesmentEntity = new InvesmentEntity({
        investingEntity: {
            accountType: req.body.accountType,
            taxId: req.body.taxId,
        },
        accountInformation: {
            entityName: req.body.entityName,
            accredited: req.body.accredited,
        },
        mailingInformation: {
            address: req.body.address,
            city: req.body.city,
            postalCode: req.body.postalCode,
            country: req.body.country,
            state: req.body.state,
        },
        bankingInformation: {
            paymentMethod: req.body.paymentMethod,
            routingABANumber: req.body.routingABANumber,
            SWIFTCode: req.body.SWIFTCode,
            accountNumber: req.body.accountNumber,
            financialInstitutions: req.body.financialInstitutions,
            fundingNotes: req.body.fundingNotes,
        }
    });
    await invesmentEntity.save();

    const entity = await User.findOneAndUpdate({ _id: req.body.userId }, {
        $push: { invesmentEntity: {
            entityId: invesmentEntity._id,
            name: req.body.entityName,
        }}
    }, {
        "fields": { "invesmentEntity": 1 },
        "new": true 
    });
    console.log(entity);

    const entityName = [];
    for (var i = 0; i < entity.invesmentEntity.length; i++) {
        entityName[i] = entity.invesmentEntity[i].name;
    }

    console.log(entityName);
    res.status(200).send(entityName);
};

exports.documents = async (req, res) => {
    let error = req.flash('error');
    if (error.length > 0) error = error[0];
    else error = null;

    res.render('user/documents', {
        pageTitle: 'Documents',
        isAuthenticated: req.session.isLoggedIn,
        userId: req.session.user._id,
        invesmentId: req.session.invesmentPropertyId,
        error: error,
    });
};

exports.postDocument = async (req, res) => {
    await User.updateOne({ 
        _id: req.session.user._id, 
        'invesments.id': req.session.userInvesmentId 
    }, {
        $set: { 'invesments.$.step': 3 }
    });

    // send mail
    var transporter = mailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'khand3826@gmail.com',
            pass: 'password'
        }
    });
      
    var mailOptions = {
        from: 'khand3826@gmail.com',
        to: req.session.user.emiil,
        subject: 'Your Invesment has been submitted',
        text: 'Boron Capitals'
    };
      
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    res.redirect('/investorSuitability');
};  

exports.investorVerification = async (req, res) => {
    let error = req.flash('error');
    if (error.length > 0) error = error[0];
    else error = null;

    res.render('user/investorVerification', {
        pageTitle: 'Investor Verification',
        isAuthenticated: req.session.isLoggedIn,
        invesmentId: req.session.invesmentPropertyId,
        invesmentName: req.session.invesmentPropertyName,
        userId: req.session.user._id,
        userName: req.session.user.name,
        error: error,
    });
};

exports.postInvestorVerification = async (req, res) => {
    console.log(req.body.residencyStatus);
    console.log(typeof req.body.residencyStatus);

    const error = __.validate(req.body, {
        firstName: Joi.string().required(),
        middleName: Joi.string().required(),
        lastName: Joi.string().required(),
        dob: Joi.string().required(),
        primaryPhone: Joi.string().required(),
        code: Joi.string().required(),
        residencyStatus: Joi.string().required(),
        address: Joi.string().required(),
        city: Joi.string().required(),
        country: Joi.string().required(),
        postalCode: Joi.string().required(),
        state: Joi.string().required(),
        employmentStatus: Joi.string().required(),
        annualIncome: Joi.string().required(),
        netWorth: Joi.string().required(),
        stockBroker: Joi.string().required(),
    });
    if (error) {
        req.flash('error', error.details[0].message);
        return res.redirect('/investorVerification');
    }

    const investorVerification = { ...req.body };

    await UserInvesment.updateOne({ _id: req.session.userInvesmentId }, {
        $set: { investorVerification: investorVerification }
    });

    await User.updateOne({ 
        _id: req.session.user._id, 
        'invesments.id': req.session.userInvesmentId 
    }, {
        $set: { 'invesments.$.step': 2 }
    });

    res.redirect('/documents');
};

exports.investorSuitability = async (req, res) => {
    res.render('user/investorSuitability', {
        pageTitle: 'Investor Suitability',
        isAuthenticated: req.session.idLoggedIn,
        userId: req.session.user._id,
    });
};

exports.myTransactions = async (req, res) => {
    let userInvesments = [];
    const { invesments } = await User.findOne({ _id: req.session.user._id }, 'invesments');

    for (let i = 0; i < invesments.length; i++) {
        const inv = await UserInvesment.findOne({ _id: invesments[i].userInvesmentId },
            'invesmentProperty invesmentCommited investingEntity');

        let step = invesments[i].step;
        let actionRequired, latestUpdate, nextStep, proceed, proceedLink;
        if (step == 1) {
            actionRequired = '';
            latestUpdate = 'Your offering has been submited';
            nextStep = 'Provide investor verification details';
            proceed = 'Investor Verification';
            proceedLink = '/investorVerification';
        } else if (step == 2) {
            actionRequired = '';
            latestUpdate = 'You submitted your verification details';
            nextStep = 'Upload your signature document';
            proceed = 'Upload Document';
            proceedLink = '/documents';
        } else if (step == 3) {
            actionRequired = '';
            latestUpdate = 'You upload your signature socument';
            nextStep = 'Upload Investor Suitability Documents';
            proceed = 'Investor Suitability';
            proceedLink = '/investorSuitability';
        }

        const m = {
            name: inv.invesmentProperty.name,
            offer: inv.invesmentCommited,
            investingEntity: inv.investingEntity,
            actionRequired,
            latestUpdate, 
            nextStep,
            proceed,
            proceedLink,
            id: req.session.invesmentPropertyId,
        };
        userInvesments[i] = m;
    }

    res.render('user/myTransactions', {
        pageTitle: 'My transactions',
        isAuthenticated: req.session.isLoggedIn,
        invesments: userInvesments,
    });
}

exports.myDocuments = async (req, res) => {
    res.render('user/myDocuments', {
        pageTitle: 'My Documents',
        isAuthenticated: req.session.isLoggedIn,
    })
}