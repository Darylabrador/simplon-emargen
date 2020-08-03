const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const User = require('../models/users');

/**
 * Get login page
 * 
 * Render the login page
 * @function getLogin
 * @returns {VIEW} login view
 * @throws Will throw an error if one error occursed
 */
exports.getLogin = (req, res, next) => {
    if (req.session.userId) {
        return res.redirect('admin/dashboard');
    }
    res.render('auth/login', {
        title: "Connexion",
        path: '',
        errorMessage: null,
        hasError: false,
        validationErrors: [],
        page: 'login'
    });
};

/**
 * Get signup page
 *
 * Render the signup page
 * @function getSignup
 * @returns {VIEW} signup view
 * @throws Will throw an error if one error occursed
 */
exports.getSignup = (req, res, next) => {
    if (req.session.userId) {
        return res.redirect('admin/dashboard');
    }
    res.render('auth/signup', {
        title: "Inscription",
        path: '',
        errorMessage: null,
        hasError: false,
        validationErrors: [],
        page: 'signup'
    });
};

/**
 * Handle post login
 *
 * @function postLogin
 * @returns {VIEW} redirect to '/dashboard'
 * @throws Will throw an error if one error occursed
 */
exports.postLogin = async (req, res, next) => {
    const { email, password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('auth/login', {
            path: '/login',
            title: 'Connexion',
            errorMessage: errors.array()[0].msg,
            hasError: true,
            oldInput: {
                email: email,
                password: password
            },
            validationErrors: errors.array(),
            page: 'login'
        });
    }

    try {
        const user = await User.findOne({ email: email });

        if (!user) {
            req.flash('error', 'Adresse email ou mot de passe invalide');
            return res.redirect('/login');
        }

        const isEqual = await bcrypt.compare(password, user.password);

        if (isEqual) {
            req.session.isLoggedIn = true;
            req.session.userId = user._id;
            return req.session.save(err => {
                res.redirect('admin/dashboard');
            });
        }
        req.flash('error', 'Adresse email ou mot de passe invalide');
        res.redirect('/login');

    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        next(err);
        return err;
    }
}

/**
 * Handle post signup
 *
 * @function postSignup
 * @returns {VIEW} redirect to '/login'
 * @throws Will throw an error if one error occursed
 */
exports.postSignup = async (req, res, next) => {
    const { pseudo, email, password, passwordConfirm } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('auth/signup', {
            path: '/signup',
            title: 'Inscription',
            errorMessage: errors.array()[0].msg,
            hasError: true,
            oldInput: {
                pseudo: pseudo,
                email: email,
                password: password,
                passwordConfirm: passwordConfirm
            },
            validationErrors: errors.array(),
            page: 'signup'
        });
    }

    try {
        const hashedPwd = await bcrypt.hash(password, 12);

        const user = new User({
            email: email,
            password: hashedPwd
        });

        const userCreated = await user.save();
        req.flash('success', 'Votre inscription a bien été pris en compte');
        res.redirect('/login');
        return userCreated;
    } catch (error) {
        return res.status(500).render('auth/signup', {
            path: '/signup',
            title: 'Inscription',
            errorMessage: "Adresse email ou pseudo existe déjà",
            hasError: true,
            oldInput: {
                pseudo: pseudo,
                email: email,
                password: password,
                passwordConfirm: passwordConfirm
            },
            validationErrors: [],
            page: 'signup'
        });
    }
};


/**
 * Handle logout
 *
 * @function logout
 * @returns {VIEW} redirect to '/login'
 */
exports.logout = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        }
        res.redirect('/login');
    });
};