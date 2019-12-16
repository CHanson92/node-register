/* eslint-disable no-underscore-dangle */
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const auth = require('http-auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();
const Registration = mongoose.model('Registration');

router.get('/', (req, res) => {
    res.render('form', {
        title: 'Registration form',
        header: 'Please sign up here',
    });
});

router.post(
    '/',
    [
        body('name')
            .isLength({ min: 1 })
            .withMessage('Please enter a name'),
        body('email')
            .isLength({ min: 1 })
            .withMessage('Please enter an email'),
    ],
    (req, res) => {
        const errors = validationResult(req);

        if (errors.isEmpty()) {
            const registration = new Registration(req.body);
            registration
                .save()
                .then(() => {
                    res.render('registered', {
                        title: 'Registered',
                        header: 'App',
                    });
                })
                .catch(() => {
                    res.render('404', { title: '404 Error' });
                });
        } else {
            res.render('form', {
                title: 'Registration form',
                header: 'Please sign up here',
                errors: errors.array(),
                data: req.body,
            });
        }
    }
);

const basic = auth.basic({
    file: path.join(__dirname, '../users.htpasswd'),
});

router.get('/registrations', auth.connect(basic), (req, res) => {
    Registration.find()
        .then(registrations => {
            res.render('index', {
                title: 'Listing registrations',
                header: 'Admin Area',
                registrations,
            });
        })
        .catch(() => {
            res.render('404', { title: '404 Error', header: '404 Error' });
        });
});

router.post('/delete', (req, res) => {
    try {
        const id = req.body.__v;
        Registration.deleteOne(id).exec();
        res.redirect('/registrations');
    } catch (error) {
        res.render('404', { title: '404 Error', header: '404 Error' });
    }
});

module.exports = router;
