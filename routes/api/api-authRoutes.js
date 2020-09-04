/** Views routes
 * @module routers/api-auth
 * @requires express express.Router()
 */
const express   = require('express');
const { body }  = require('express-validator');

const isAuthApi = require('../../middleware/is-auth-api');

const apiAuthController = require('../../controllers/api/api-authController');

const router = express.Router();

/**
 * Handle login from API (mobile client)
 * @name postLogin POST
 * @function
 * @memberof module:routers/api-auth
 * @param {string} '/api/login' - uri
 * @param {function} adminController.postLogin
 */
router.post(
    '/login', 
    [
        body('email', 'Adresse email invalide')
            .isEmail()
            .trim(),
        body('password', 'Mot de passe : minimum 5 caractères')
            .isLength({ min: 5 })
            .trim()
    ],
    apiAuthController.postLogin
);


/**
 * Handle resetting password from API (mobile client)
 * @name postReinitPass POST
 * @function
 * @memberof module:routers/api-auth
 * @param {string} '/api/reinitialisation' - uri
 * @param {function} adminController.postReinitPass
 */
router.post(
    '/reinitialisation', 
    isAuthApi, 
    [
        body('oldpass', 'Renseigner votre ancien mot de passe')
            .not()
            .isEmpty(),
        body('newpass', 'Mot de passe : minimum 5 caractères')
            .isLength({ min: 5 })
            .trim(),
        body('newpassconfirm')
            .trim()
            .custom((value, { req }) => {
                if (value !== req.body.newpass) {
                    throw new Error('Les mots de passe ne sont pas identiques');
                }
                return true;
            })
    ],
    apiAuthController.postReinitPass
);

module.exports = router;