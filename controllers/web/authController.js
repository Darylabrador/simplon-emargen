/**
 * Authentication controller for web application
 */

// Package error validation and hash password
const { validationResult } = require('express-validator');
const bcrypt               = require('bcryptjs');
const nodemailer           = require('nodemailer');
const sengridTransport     = require('nodemailer-sendgrid-transport');
const crypto               = require('crypto');
const dotenv               = require('dotenv').config();

// user model
const User                 = require('../../models/users');

// Send mail configuration
const transporter = nodemailer.createTransport(sengridTransport({
    auth: {
        api_key: `${process.env.API_KEY}`
    }
}));

/**
 * Get login page
 * 
 * Render login page 
 * @function getLogin
 * @returns {VIEW} login view
 */
exports.getLogin = (req, res, next) =>{
    if (req.session.userId) {
        return res.redirect('/admin');
    }
    res.render('auth/login', {
        title: "Connexion",
        path: '',
        errorMessage: null,
        hasError: false,
        validationErrors: [],
    });
}

/**
 * Get reinitialisation page without token
 *
 * Render reinitialisation page w/o token
 * @function getReinitialisation
 * @returns {VIEW} reinitialisation view
 */
exports.getReinitialisation = (req, res, next) => {
    if (req.session.userId) {
        return res.redirect('/admin');
    }
    
    res.render('auth/resetPass', {
        title: "Réinitialisation",
        isReset: false,
        path: '',
        errorMessage: null,
        hasError: false,
        validationErrors: [],
        resetToken: null
    });
}

/**
 * Get reinitialisation page with token
 * 
 * Render reinitialisation page with token
 * @function getReinitialisationToken
 * @returns {VIEW} reinitialisation view
 */
exports.getReinitialisationToken = async (req, res, next) => {
    const resetToken = req.params.resetToken;
    
    try {
        const user = await User.findOne({resetToken: resetToken});

        if(!user) {
            req.flash('error', 'Token de réinitialisation invalide');
            return res.redirect('/reinitialisation');
        }

        res.render('auth/resetPass', {
            title: "Réinitialisation",
            isReset: true,
            path: '',
            errorMessage: null,
            hasError: false,
            validationErrors: [],
            resetToken: resetToken
        });
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        next(err);
        return err;
    }
}

/**
 * Handle post login
 *
 * @function postLogin
 * @returns {VIEW} redirect to '/admin'
 * @throws Will throw an error if one error occursed
 */
exports.postLogin = async (req, res, next) =>{
    const { email, password } = req.body;
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(422).render('auth/login', {
            title: "Connexion",
            path: '',
            hasError: true,
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array(),
            oldInput: {
                email: email,
                password: password
            }
        });
    }

    try {
        const user = await User.findOne({email : email});

        if(!user) {
            req.flash('error', 'Adresse email ou mot de passe invalide');
            return res.redirect('/login');
        }

        if(user.role != "admin") {
            req.flash('error', "Vous n'avez pas les droits");
            return res.redirect('/login');
        }

        const isEqual = await bcrypt.compare(password, user.password);

        if(isEqual){
            req.session.isLoggedIn = true;
            req.session.userId     = user._id;
            return req.session.save(err => {
                res.redirect('/admin');
            });
        };

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
 * Handle post reset w/o token
 *
 * @function postReset
 * @returns {VIEW} redirect to '/reinitialisation'
 * @throws Will throw an error if one error occursed
 */
exports.postReset = async (req, res, next) => {
    const { email } = req.body;
    const errors    = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('auth/resetPass', {
            title: "Réinitialisation",
            isReset: false,
            path: '',
            hasError: true,
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array(),
            resetToken: null
        });
    };

    try {
        const user = await User.findOne({email: email});

        if(!user) {
            req.flash('error', 'Email inconnue');
            return res.redirect('/reinitialisation');
        }

        if (user.role != "admin") {
            req.flash('error', "Vous n'avez pas les droits");
            return res.redirect('/reinitialisation');
        }

        const resetToken = await crypto.createHmac('sha256', 'm0MZyY48MIPcv8uQYPx9').update(email).digest('hex');
        user.resetToken  = resetToken;
        await user.save();

        await transporter.sendMail({
            to: email,
            from: `${process.env.EMAIL_USER}`,
            subject: 'Réinitialisation',
            html: `<p>
                    Pour réinitiliaser votre mot de passe, veuillez cliqué sur le lien ci-dessous : <br> 
                    http://localhost:3000/reinitialisation/${resetToken}
                </p>`
        });

        req.flash('success', 'Un email de réinitialisation a été envoyé !');
        res.redirect('/reinitialisation');
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        next(err);
        return err;
    }
}

/**
 * Handle post reset with token
 *
 * @function postResetPass
 * @returns {VIEW} redirect to '/login'
 * @throws Will throw an error if one error occursed
 */
exports.postResetPass = async (req, res, next) => {
    const { resetToken, newpass } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash('error', errors.array()[0].msg);
        return res.redirect(`/reinitialisation/${resetToken}`);
    }

    try {
        const user = await User.findOne({ resetToken: resetToken });

        if (!user) {
            req.flash('error', 'Token de réinitialisation invalide');
            return res.redirect('/reinitialisation/');
        }

        const newHashedPwd = await bcrypt.hash(newpass, 12);
        user.password   = newHashedPwd;
        user.resetToken = null;
        await user.save();

        req.flash('success', 'Mot de passe réinitialiser avec succès');
        return res.redirect('/login');

    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        next(err);
        return err;
    }
}

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

// exports.getSignup = (req, res, next) => {
//     res.render('auth/simpleSignup', {
//         title: "Inscription",
//         path: '',
//         errorMessage: null,
//         hasError: false,
//         validationErrors: []
//     });
// }

// exports.postSignup = async (req, res, next) => {
//     const { name, surname, email, password } = req.body;
    
//     try {
//         const hashedPwd = await bcrypt.hash(password, 12);

//         const newUser = new User({
//             name: name.toUpperCase(),
//             surname: surname.charAt(0).toUpperCase() + surname.slice(1),
//             email: email,
//             password: hashedPwd
//         });

//         await newUser.save();
//         res.redirect('/login');
//     } catch (error) {
//         const err = new Error(error);
//         err.httpStatusCode = 500;
//         next(err);
//         return err;
//     }
// }