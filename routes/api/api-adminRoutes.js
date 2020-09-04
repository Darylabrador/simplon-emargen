/** Views routes
 * @module routers/api-admin
 * @requires express express.Router()
 */
const express  = require('express');
const { body } = require('express-validator');
const multer   = require('multer');

const isAuthApi = require('../../middleware/is-auth-api');

const apiAdminController = require('../../controllers/api/api-adminController');

// Multer configurations
const signatureStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './data/signatures');
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

const uploadImage = multer({ storage: signatureStorage, fileFilter: imageFilter }).single('signature');

const router = express.Router();

/**
 * Handle when user config his sign picture (mobile client)
 * @name postSignature POST
 * @function
 * @memberof module:routers/api-admin
 * @param {string} '/api/configuration/signature' - uri
 * @param {function} adminController.postSignature
 */
router.post('/configuration/signature', isAuthApi, uploadImage, apiAdminController.postSignature);


/**
 * Handle sign document when scanning QRcode (mobile client)
 * @name signEmargement GET
 * @function
 * @memberof module:routers/api-admin
 * @param {string} '/api/emargements/signature' - uri
 * @param {function} adminController.signEmargement
 */
router.get('/emargements/signature', isAuthApi, apiAdminController.signEmargement);

module.exports = router;