const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/User');

//get routes to display register and login
router.get('/register', (req, res) => {
    res.render('auth/register', { title: 'Register' });
});

router.get('/login', (req, res) => {
    res.render('auth/login', { title: 'Login' });
});

//Post route for registering a new user
router.post('/register', async (req, res) => {
    try {
       const { username, password } = req.body;
       const existing = await User.findOne({ username: username });

       if (existing) {
           return res.status(400).render('auth/register', { error: 'Username already exists' });
       }

       //hash the password
       const passwordHash = await bcrypt.hash(password, 10);

       await User.create({ username: username, passwordhash: passwordHash });
       res.redirect('/login');
    } catch (err) {
        res.status(400).render('auth/register', { error: 'Error registering user' });
    }
});

//Login via credentials
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
}));

//Logout route
router.post('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/login');
    });
});

module.exports = router;