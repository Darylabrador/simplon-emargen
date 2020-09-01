/** Views routes
 * @module routers/api-auth
 * @requires express express.Router()
 */
const express   = require('express');
const { body }  = require('express-validator');

const apiAuthController = require('../../controllers/api/api-authController');

const router = express.Router();

router.post('/login');

router.post('/reinitialisation');

module.exports = router;