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

router.post('/configuration/signature', isAuthApi, uploadImage);

router.post('/emargements/signature', isAuthApi);

// router.get('/emargements/signature', isAuthApi);

router.get('/emargements/signature', apiAdminController.signEmargement);

module.exports = router;