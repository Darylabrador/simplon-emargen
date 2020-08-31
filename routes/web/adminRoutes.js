/** Views routes
 * @module routers/admin
 * @requires express express.Router()
 */

const express   = require('express');
const multer    = require('multer');
const { body }  = require('express-validator');

const adminController     = require('../../controllers/web/adminController');
const adminActsController = require('../../controllers/web/actionAdminController');
const isAuth              = require('../../middleware/is-auth');

// Multer configurations
const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    }
});

const imageFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const uploadImage = multer({ storage: imageStorage, fileFilter: imageFilter }).single('logo');

const router = express.Router();

/**
 * Get index page
 * @name getIndex GET
 * @function
 * @memberof module:routers/admin
 * @param {string} '/admin' - uri
 * @param {function} adminController.getIndex
 */
router.get('/', isAuth, adminController.getIndex);


/**
 * Get setting menu
 * @name getGeneralSettings GET
 * @function
 * @memberof module:routers/admin
 * @param {string} '/admin/settings' - uri
 * @param {function} adminController.getGeneralSettings
 */
router.get('/settings', isAuth, adminController.getGeneralSettings);


/**
 * Get edit informations page
 * @name getGeneralSettings GET
 * @function
 * @memberof module:routers/admin
 * @param {string} '/admin/settings/informations' - uri
 * @param {function} adminController.getInformationSettings
 */
router.get('/settings/informations', isAuth, adminController.getInformationSettings);


/**
 * Get reset password page
 * @name getPasswordSettings GET
 * @function
 * @memberof module:routers/admin
 * @param {string} '/admin/settings/informations' - uri
 * @param {function} adminController.getPasswordSettings
 */
router.get('/settings/password', isAuth, adminController.getPasswordSettings);


/**
 * Get all templates page
 * @name getTemplates GET
 * @function
 * @memberof module:routers/admin
 * @param {string} '/admin/templates' - uri
 * @param {function} adminController.getTemplates
 */
router.get('/templates', isAuth, adminController.getTemplates);


/**
 * Get form to add template
 * @name getAddTemplate GET
 * @function
 * @memberof module:routers/admin
 * @param {string} '/admin/templates' - uri
 * @param {function} adminController.getAddTemplate
 */
router.get('/templates/add', isAuth, adminController.getAddTemplate);


/**
 * Get edit informations template
 * @name getEditTemplate GET
 * @function
 * @memberof module:routers/admin
 * @param {string} '/admin/templates/edit/:templateId' - uri
 * @param {function} adminController.getEditTemplate
 */
router.get('/templates/edit/:templateId', isAuth, adminController.getEditTemplate);


/**
 * Get all emargement page
 * @name getEmargements GET
 * @function
 * @memberof module:routers/admin
 * @param {string} '/admin/emargements' - uri
 * @param {function} adminController.getEmargements
 */
router.get('/emargements', isAuth, adminController.getEmargements);


/**
 * Get emargement iframe page
 * @name getEmargementsIframe GET
 * @function
 * @memberof module:routers/admin
 * @param {string} '/admin/emargements/:emargementId' - uri
 * @param {function} adminController.getEmargementsIframe
 */
router.get('/emargements/:emargementId', isAuth, adminController.getEmargementsIframe);


/**
 * Get promotions page
 * @name getPromotions GET
 * @function
 * @memberof module:routers/admin
 * @param {string} '/admin/promotions' - uri
 * @param {function} adminController.getPromotions
 */
router.get('/promotions', isAuth, adminController.getPromotions);


/**
 * Get apprenants page
 * @name getApprenants GET
 * @function
 * @memberof module:routers/admin
 * @param {string} '/admin/apprenants' - uri
 * @param {function} adminController.getApprenants
 */
router.get('/apprenants', isAuth, adminController.getApprenants);

router.post(
    '/settings/informations', 
    isAuth, 
    [
        body('name', 'Nom obligatoire')
            .not()
            .isEmpty(),
        body('surname', 'Prénom obligatoire')
            .not()
            .isEmpty(),
        body('email', 'Renseigner une adresse email valide')
            .isEmail()
    ],
    adminActsController.postEditInformations
);

router.post(
    '/settings/password', 
    isAuth,
    [
        body('oldpass', 'Veuillez saisir votre ancien mot de passe')
            .not()
            .isEmpty(),
        body('newpass', 'Veuillez saisir un mot de passe qui contient au minimum 5 caractères')
            .isLength({ min: 5 })
            .trim(),
        body('newpassconfirm')
            .trim()
            .custom((value, { req }) => {
                if (value !== req.body.newpass) {
                    throw new Error('Les mots de passe ne sont pas identiques')
                }
                return true;
            }),
    ],
    adminActsController.postEditPassword
);


router.post(
    '/templates/add', 
    isAuth,
    uploadImage,
    [
        body('name', 'Obligatoire : Nom du template')
            .not()
            .isEmpty(),
        body('organisme', 'Obligatoire : Nom de l\'organisme de formation')
            .not()
            .isEmpty(),
        body('intitule', 'Obligatoire: Intitule')
            .not()
            .isEmpty()
    ],
    adminActsController.addTemplate
);

router.post(
    '/templates/edit',
    isAuth,
    uploadImage,
    [
        body('name', 'Obligatoire : Nom du template')
            .not()
            .isEmpty(),
        body('organisme', 'Obligatoire : Nom de l\'organisme de formation')
            .not()
            .isEmpty(),
        body('intitule', 'Obligatoire: Intitule')
            .not()
            .isEmpty()
    ],
    adminActsController.editTemplate
);


router.post('/templates/delete', isAuth, adminActsController.deleteTemplate);

router.post('');

router.post('');

router.post('');

router.post('');

router.post('');

router.post('');

module.exports = router;