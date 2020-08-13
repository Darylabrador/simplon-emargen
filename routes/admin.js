const express  = require('express');
const multer   = require('multer');
const { body } = require('express-validator');

const isAuth = require('../middleware/is-auth');

const adminController = require('../controllers/adminController');

const router = express.Router();

/** Views routes
 * @module routers/admin
 * @requires express express.Router()
 */

// storage uploaded file
const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    }
});

// filter image by extension
const imageFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

// multer middleware
const uploadImage = multer({ storage: imageStorage, fileFilter: imageFilter }).single('image');

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
 * Create template for sign-off sheet PDF
 * @name addtemplate POST
 * @function
 * @memberof module:routers/admin
 * @param {string} 'admin/addtemplate' - uri
 * @param {function} adminController.addtemplate
 */
router.post(
    '/addtemplate',
    isAuth,
    uploadImage,
    [
        body('name', 'Veuillez renseigner un nom pour le template')
            .not()
            .isEmpty(),
        body('intitule', 'Veuillez renseigner l\'intitulé')
            .not()
            .isEmpty(),
        body('organisme', 'Veuillez renseigner un organisme de formation')
            .not()
            .isEmpty(),
    ],
    adminController.addtemplate
);


/**
 * Get all templates
 * @name getAllTemplate GET
 * @function
 * @memberof module:routers/admin
 * @param {string} 'admin/templates' - uri
 * @param {function} adminController.getAllTemplate
 */
router.get('/templates', isAuth, adminController.getAllTemplate);


/**
 * Get get Specific template
 * @name getSpecificTemplate GET
 * @function
 * @memberof module:routers/admin
 * @param {string} 'admin/templates/:templateId' - uri
 * @param {function} adminController.getSpecificTemplate
 */
router.get('/template/:templateId', isAuth, adminController.getSpecificTemplate);


/**
 * Update Template
 * @name updateTemplate POST
 * @function
 * @memberof module:routers/admin
 * @param {string} 'admin/template/update' - uri
 * @param {function} adminController.updateTemplate
 */
router.post(
    '/template/update',
    isAuth,
    uploadImage,
    [
        body('templateId', 'Une erreur est survenue veuillez reessayé !')
            .not()
            .isEmpty(),
        body('nameUpdate', 'Le champ du nom du template ne peut pas être vide')
            .not()
            .isEmpty(),
        body('intituleUpdate', 'L\'intitulé ne peut pas être vide')
            .not()
            .isEmpty(),
        body('organismeUpdate', 'Le champ organisme de formation ne peut pas être vide')
            .not()
            .isEmpty(),
    ],
    adminController.updateTemplate
);

/**
 * delete Template
 * @name deleteTemplate POST
 * @function
 * @memberof module:routers/admin
 * @param {string} 'admin/template/delete/:templateId' - uri
 * @param {function} adminController.deleteTemplate
 */
router.post('/template/delete/:templateId', isAuth, adminController.deleteTemplate);

/**
 * Generate data for Sign-off Sheet PDF
 * @name getDataFromSheet POST
 * @function
 * @memberof module:routers/admin
 * @param {string} 'admin/signoffsheet' - uri
 * @param {function} adminController.getDataFromSheet
 */
router.post('/signoffsheet', isAuth, adminController.getDataFromSheet);


/**
 * Synchronise Google Sheet and our app Sign-off Sheet
 * @name synchronisationToSheet POST
 * @function
 * @memberof module:routers/admin
 * @param {string} 'admin/signoffsheet/synchro' - uri
 * @param {function} adminController.synchronisationToSheet
 */
router.post('/signoffsheet/synchro', isAuth, adminController.synchronisationToSheet);


/**
 * Generate Specific Sign-off Sheet PDF
 * @name generatePdf GET
 * @function
 * @memberof module:routers/admin
 * @param {string} 'admin/signoffsheet/generate/:signoffId' - uri
 * @param {function} adminController.generatePdf
 */
router.get('/signoffsheet/generate/:signoffId', isAuth, adminController.generatePdf);

module.exports = router;