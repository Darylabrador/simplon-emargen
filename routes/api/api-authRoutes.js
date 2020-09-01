/** Views routes
 * @module routers/api-auth
 * @requires express express.Router()
 */
const express   = require('express');
const { body }  = require('express-validator');

const isAuthApi = require('../../middleware/is-auth-api');

const apiAuthController = require('../../controllers/api/api-authController');

const router = express.Router();

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

router.post(
    '/reinitialisation', 
    isAuthApi, 
    [
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