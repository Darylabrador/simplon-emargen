/** Views routes
 * @module routers/admin
 * @requires express express.Router()
 */

const express = require('express');

const adminController = require('../../controllers/web/adminController');

const router = express.Router();

router.get('/', adminController.getIndex);

router.get('/settings', adminController.getGeneralSettings);

router.get('/settings/informations', adminController.getInformationSettings);

router.get('/settings/password', adminController.getPasswordSettings);

router.get('/templates', adminController.getTemplates);

router.get('/templates/add', adminController.getAddTemplate);

router.get('/templates/edit/:templateId', adminController.getEditTemplate);

router.get('/emargements', adminController.getEmargements);

router.get('/emargements/:emargementId', adminController.getEmargementsIframe);

router.get('/promotions', adminController.getPromotions);

router.get('/apprenants', adminController.getApprenants);

module.exports = router;