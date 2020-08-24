/** Views routes
 * @module routers/auth
 * @requires express express.Router()
 */

const express        = require('express');
const authController = require('../../controllers/web/authController');

const router  = express.Router();

router.get('/', authController.getLogin);

router.get('/login', authController.getLogin);

router.get('/reinitialisation', authController.getReinitialisation);

router.get('/reinitialisation/:resetToken', authController.getReinitialisationToken);

module.exports = router;