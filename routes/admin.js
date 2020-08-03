const express  = require('express');
const { body } = require('express-validator');

const isAuth = require('../middleware/is-auth');

const adminController = require('../controllers/adminController');

const router = express.Router();

/** Views routes
 * @module routers/admin
 * @requires express express.Router()
 */

/**
 * Return view with all generated pdf
 * @name getDashboard GET
 * @function
 * @memberof module:routers/admin
 * @param {string} 'admin/dashboard' - uri
 * @param {function} adminController.getDashboard
 */
router.get('/dashboard', isAuth, adminController.getDashboard);


/**
 * Generate Sign-off Sheet PDF
 * @name postSignOffShettPdf POST
 * @function
 * @memberof module:routers/admin
 * @param {string} 'admin/signoffsheet' - uri
 * @param {function} adminController.postSignOffShettPdf
 */
router.post(
    '/signoffsheet', 
    isAuth,
    [
        body('createdBy', 'Une erreur est survenue, veuillez ressayé')
            .trim()
            .not()
            .isEmpty(),
        body('intitule', 'Veuillez renseigné l\'intitulé')
            .not()
            .isEmpty(),
        body('dataSheetUrl', 'Veuillez renseigner une URL valide')
            .isURL()
    ],
    adminController.postSignOffShettPdf
);


module.exports = router;