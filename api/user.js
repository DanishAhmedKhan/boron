const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const _ = require('lodash');
const __ = require('./apiUtil');

const User = require('../schema/User');

const router = express.Router();


const signup = async (req, res) => {
    const error = __.validate(req.body, {
        email: Joi.require().string().min(5).max(50).email(),
        password: Joi.require().string().min(5).max(50),
    });
    if (error) return res.status(400).send(__.error(error.details[0].message));

    const { email, password } = req.body;

    let user;
    user = await User.findOne({ email });
    if (user) return res.status(400).send(__.error('User already registered.'));

    user = { email, password };

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    const newUser = new User();
    newUser.save();
    const token = newUser.generateAuthToken();

    res.header('x-user-auth-token', token)
       .status(200)
       .send(__.success('Signup completed'));
};

const login = async (req, res) => {
    const error = __.validate(req.body, {
        email: Joi.require().string().min(5).max(50).email(),
        password: Joi.required().string().min(5).max(50),
    });
    if (error) return res.status(400).send(__.error(error.details[0].message));

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send(__.error('Invalid email or password.'));

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send(__.error('Invalid email or password'));

    const token = user.generateAuthToken();
    res.header('x-user-auth-token', token)
       .status(200)
       .send(__.success('Loged in.'));
}


router.post('/signup', signup);
router.post('/login', login);

module.exports = router;