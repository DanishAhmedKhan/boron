const Joi = require('joi');
const bcrypt = require('bcrypt');
const User = require('../schema/User');
const __ = require('./util');

exports.getSignup = async (req, res) => {
    let error = req.flash('error');
    if (error.length > 0) error = error[0];
    else error = null;
    
    res.render('user/signup', {
        pageTitle: 'Signup',
        isAuthenticated: false,
        error: error,
    });
};

exports.postSignup = async (req, res) => {
    const error = __.validate(req.body, {
        name: Joi.string().required(),
        email: Joi.string().email().min(5).max(50).required(),
        password: Joi.string().min(5).max(50).required(), 
    });
    if (error) {
        req.flash('error', error.details[0].message);
        return res.redirect('/signup');
    }

    let user = await User.findOne({ email: req.body.email });
    if (user) {
        req.flash('error', 'User already signed up');
        return res.redirect('/signup');
    }

    user = new User({ ...req.body, profileStatus: 1 });
    user.password = await bcrypt.hash(user.password, 12);
    user.save();

    req.session.isLoggedIn = true;
    req.session.user = user;
    req.session.save(err => {
        console.log(err);
        //if (profileStatus == 1)
            //res.redirect('/profile');
        //else if (profileStatus == 2) 
            //res.redirect('/accessInvestorPortal');
        //else 
        res.redirect('/profile');
    });
}

exports.getLogin = async (req, res) => {
    if (req.session.isLoggedIn === true) {
        return res.redirect('/');
    }

    let error = req.flash('error');
    if (error.length > 0) error = error[0];
    else error = null;

    res.render('user/login', {
        pageTitle: 'Login',
        isAuthenticated: false,
        error: error,
    });
};

exports.postLogin = async (req, res) => {
    const error = __.validate(req.body, {
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    });
    if (error) {
        req.flash('error', error.details[0].message);
        return res.redirect('/login');
    }

    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        req.flash('error', 'Invalid email or password');
        return res.redirect('/login');
    }

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
        req.flash('error', 'Invalid email or password');
        return res.redirect('/login');
    }

    user = {
        _id: user._id,
        name: user.name,
        email: user.email,
        profileStatus: user.profileStatus,
    };

    req.session.isLoggedIn = true;
    req.session.user = user;
    req.session.save(err => {
        console.log(err);
        const profileStatus = user.profileStatus;
        if (profileStatus == 1)
            res.redirect('/profile');
        else if (profileStatus == 2) 
            res.redirect('/accessInvestorPortal'); 
        else res.redirect('/');
    });
};

exports.logout = async (req, res) => {
    req.session.destroy((err) => {
        if (err) return console.log(err);
        res.redirect('/login');
    });
}