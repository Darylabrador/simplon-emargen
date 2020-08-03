const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/authController');
const User = require('../models/users');

const router = express.Router();

/** Views routes
 * @module routers/auth
 * @requires express express.Router()
 */

/**
* Return login views
* @name getLogin GET
* @function
* @memberof module:routers/auth
* @param {string} '/' - uri
* @param {function} authController.getLogin
*/
router.get('/', authController.getLogin);

/**
* Return login views
* @name getLogin GET
* @function
* @memberof module:routers/auth
* @param {string} '/login' - uri
* @param {function} authController.getLogin
*/
router.get('/login', authController.getLogin);

/**
 * Return signup view
 * @name getSignup GET
 * @function
 * @memberof module:routers/auth
 * @param {string} '/signup' - uri
 * @param {function} authController.getSignup
 */
router.get('/signup', authController.getSignup);

/**
 * Handling user's connection
 * @name postLogin POST
 * @function
 * @memberof module:routers/auth
 * @param {string} '/login' - uri
 * @param {function} authController.postLogin
 */
router.post('/login',
    [
        body('email')
            .isEmail()
            .trim()
            .withMessage('Adresse email est invalide'),
        body('password', 'Votre mot de passe doit contenir au minimum 5 caractères')
            .isLength({ min: 5 })
            .trim()
    ],
    authController.postLogin
);

/**
 * Handling when users want to create an account
 * @name postSignup POST
 * @function
 * @memberof module:routers/auth
 * @param {string} '/signup' - uri
 * @param {function} authController.postSignup
 */
router.post(
    '/signup',
    [
        body('email')
            .isEmail()
            .trim()
            .withMessage('Veuillez saisir une adresse email valide'),
        body('password', 'Veuillez saisir un mot de passe qui contient au minimum 5 caractères')
            .isLength({ min: 5 })
            .trim(),
        body('passwordConfirm').trim()
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Les mots de passe ne sont pas identiques')
                }
                return true;
            })
    ],
    authController.postSignup
);

/**
 * Handling when user disconnect
 * @name logout GET
 * @function
 * @memberof module:routers/auth
 * @param {string} '/logout' - uri
 * @param {function} authController.logout
 */
router.get('/logout', authController.logout);

module.exports = router;