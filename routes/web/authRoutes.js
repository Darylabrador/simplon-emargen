/** Views routes
 * @module routers/auth
 * @requires express express.Router()
 */

const express        = require('express');
const { body }        = require('express-validator');

const authController = require('../../controllers/web/authController');

const router  = express.Router();

/**
* Return login view
* @name getLogin GET
* @function
* @memberof module:routers/auth
* @param {string} '/' - uri
* @param {function} authController.getLogin
*/
router.get('/', authController.getLogin);

/**
* Return login view
* @name getLogin GET
* @function
* @memberof module:routers/auth
* @param {string} '/login' - uri
* @param {function} authController.getLogin
*/
router.get('/login', authController.getLogin);

/**
* Return reinitialisation view w/o token
* @name getReinitialisation GET
* @function
* @memberof module:routers/auth
* @param {string} '/reinitialisation' - uri
* @param {function} authController.getReinitialisation
*/
router.get('/reinitialisation', authController.getReinitialisation);

/**
* Return reinitialisation view with token
* @name getReinitialisationToken GET
* @function
* @memberof module:routers/auth
* @param {string} '/reinitialisation/:resetToken' - uri
* @param {function} authController.getReinitialisationToken
*/
router.get('/reinitialisation/:resetToken', authController.getReinitialisationToken);

/**
 * Handling when user disconnect
 * @name logout GET
 * @function
 * @memberof module:routers/auth
 * @param {string} '/logout' - uri
 * @param {function} authController.logout
 */
router.get('/logout', authController.logout);

/**
 * Handling user's connection
 * @name postLogin POST
 * @function
 * @memberof module:routers/auth
 * @param {string} '/login' - uri
 * @param {function} authController.postLogin
 */
router.post(
    '/login', 
    [
        body('email','Veuillez saisir une adresse email valide')
            .isEmail()
            .trim(),
        body('password', 'Veuillez saisir un mot de passe contenant au minimum 5 caractères')
            .isLength({min: 5})
            .trim()
    ],
    authController.postLogin
);


/**
 * Handling user's reinit request
 * @name postReinit POST
 * @function
 * @memberof module:routers/auth
 * @param {string} '/reinitPass' - uri
 * @param {function} authController.postReinit
 */
router.post(
    '/reinitialisation',
    [
        body('email', 'Veuillez saisir une adresse email valide')
            .isEmail()
            .trim()
    ],
    authController.postReset
);


/**
 * Handling user's reinit pass
 * @name postReinitPass POST
 * @function
 * @memberof module:routers/auth
 * @param {string} '/reinitialisation' - uri
 * @param {function} authController.postReinitPass
 */
router.post(
    '/reinitPass', 
    [
        body('newpass', 'Veuillez saisir un mot de passe contenant au minimum 5 caractères')
            .isLength({ min: 5 })
            .trim(),
        body('newpassconfirm')
            .trim()
            .custom((value, {req}) => {
                if(value !== req.body.newpass) {
                    throw new Error('Les mots de passe ne sont pas identiques');
                }
                return true;
            })
    ],
    authController.postResetPass
);

// router.get('/signup', authController.getSignup);
// router.post('/signup', authController.postSignup);

module.exports = router;