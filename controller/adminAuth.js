const Joi = require('joi');
const bcrypt = require('bcrypt');
const Admin = require('../schema/Admin');
const __ = require('./util');

exports.getSignup = async (req, res) => {
    let error = req.flash('error');
    if (error.length > 0) error = error[0];
    else error = null;
    
    res.render('admin/signup', {
        pageTitle: 'Admin Signup',
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
        return res.redirect('/adminSignup');
    }

    let admin = await Admin.findOne({ email: req.body.email });
    if (admin) {
        req.flash('error', 'Admin with that email already exists');
        return res.redirect('/adminSignup');
    }

    admin = new Admin({ ...req.body, profileStatus: 1 });
    admin.password = await bcrypt.hash(admin.password, 12);
    admin.save();

    req.session.isLoggedIn = true;
    req.session.admin = admin;
    req.session.save(err => {
        console.log(err);
        res.redirect('/adminPanel');
    });
}

exports.getLogin = async (req, res) => {
    if (req.session.isLoggedIn === true) {
        return res.redirect('/');
    }

    let error = req.flash('error');
    if (error.length > 0) error = error[0];
    else error = null;

    res.render('admin/login', {
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
        return res.redirect('/adminLogin');
    }

    let admin = await Admin.findOne({ email: req.body.email });
    if (!admin) {
        req.flash('error', 'Invalid email or password');
        return res.redirect('/adminLogin');
    }

    const match = await bcrypt.compare(req.body.password, admin.password);
    if (!match) {
        req.flash('error', 'Invalid email or password');
        return res.redirect('/adminLogin');
    }

    admin = {
        _id: user._id,
        name: user.name,
        email: user.email,
    };

    req.session.isLoggedIn = true;
    req.session.admin = admin;
    req.session.save(err => {
        console.log(err);
        res.redirect('/adminPanel');
    });
};

exports.logout = async (req, res) => {
    req.session.destroy((err) => {
        if (err) return console.log(err);
        res.redirect('/adminLogin');
    });
}