/**
 * Admin controller for web application
 */

const Template      = require('../../models/templates');
const Signoffsheet  = require('../../models/signoffsheets');
const User          = require('../../models/users');
const Yeargroup     = require('../../models/yeargroups');
const Assign        = require('../../models/assigns');

const ITEM_PER_PAGE = 6;

/**
 * Get index page 
 *
 * Render index page with signoffsheets information (w/o admin actions)
 * @function getReinitialisation
 * @returns {VIEW} index view
 */
exports.getIndex = async (req, res, next) => {
    let breadcrumb = [];
    breadcrumb.push("Accueil");

    try {
        const page       = +req.query.page || 1;
        const totalItems = await Signoffsheet.find().countDocuments();

        const signoffsheetPdf = await Signoffsheet.find()
            .skip((page - 1) * ITEM_PER_PAGE)
            .limit(ITEM_PER_PAGE).sort({ createdAt: -1 })
            .populate('templateId')
            .exec();

        res.render('index', {
            title: "Accueil",
            breadcrumb: breadcrumb,
            isTemplatePage: false,
            isEmargementPage: false,
            isPromotionPage: false,
            isApprenantPage: false,
            errorMessage: null,
            hasError: false,
            validationErrors: [],
            signoffsheetData: signoffsheetPdf,
            currentPage: page,
            hasNextPage: ITEM_PER_PAGE * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEM_PER_PAGE),
            total: totalItems
        });
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        next(err);
        return err;
    }
}


/**
 * Get general settings menu 
 *
 * Render general setting page
 * @function getGeneralSettings
 * @returns {VIEW} settings view
 */
exports.getGeneralSettings = (req, res, next) => {
    let breadcrumb = [];
    breadcrumb.push("Réglages");
    breadcrumb.push("Compte");

    res.render('account/settings', {
        title: "Compte",
        breadcrumb: breadcrumb,
        isTemplatePage: false,
        isEmargementPage: false,
        isPromotionPage: false,
        isApprenantPage: false,
        errorMessage: null,
        hasError: false,
        validationErrors: [],
    });
}


/**
 * Get form to edit account informations
 *
 * Render form to edit account informations
 * @function getInformationSettings
 * @returns {VIEW} informations view
 */
exports.getInformationSettings = async (req, res, next) => {
    let breadcrumb = [];
    breadcrumb.push("Réglages");
    breadcrumb.push("Compte");
    breadcrumb.push("Informations");

    try {
        const userInfo = await User.findOne({ _id: req.session.userId }, { name: 1, surname: 1, email: 1});
        res.render('account/informations', {
            title: "Compte",
            breadcrumb: breadcrumb,
            isTemplatePage: false,
            isEmargementPage: false,
            isPromotionPage: false,
            isApprenantPage: false,
            errorMessage: null,
            hasError: false,
            validationErrors: [],
            userInfo: userInfo
        });
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        next(err);
        return err;
    }
}


/**
 * Get form to edit account password
 *
 * Render form to edit account password
 * @function getPasswordSettings
 * @returns {VIEW} password view
 */
exports.getPasswordSettings = (req, res, next) => {
    let breadcrumb = [];
    breadcrumb.push("Réglages");
    breadcrumb.push("Compte");
    breadcrumb.push("Mot de passe");

    res.render('account/password', {
        title: "Compte",
        breadcrumb: breadcrumb,
        isTemplatePage: false,
        isEmargementPage: false,
        isPromotionPage: false,
        isApprenantPage: false,
        errorMessage: null,
        hasError: false,
        validationErrors: []
    });
}


/**
 * Get all yeargroups informations
 *
 * @function getPromotions
 * @returns {VIEW} promotions view
 */
exports.getPromotions = async (req, res, next) => {
    let breadcrumb = [];
    breadcrumb.push("Promotions");
    breadcrumb.push("Tous");

    try {
        const yeargroups = await Yeargroup.find();
        res.render('promotions/promotions', {
            title: "Promotions",
            breadcrumb: breadcrumb,
            isTemplatePage: false,
            isEmargementPage: false,
            isPromotionPage: true,
            isApprenantPage: false,
            errorMessage: null,
            hasError: false,
            validationErrors: [],
            yeargroups: yeargroups
        });
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
}

/**
 * Get single yeargroup informations
 *
 * @function getSpecificPromotion
 * @returns json
 */
exports.getSpecificPromotion = async (req, res, next) => {
    const promoId = req.params.promoId;
    try {
        const specificPromo = await Yeargroup.findOne({_id: promoId});
        return res.status(200).json({specificPromo});
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
}


/**
 * Get all learners informations
 *
 * @function getApprenants
 * @returns {VIEW} apprenants view
 */
exports.getApprenants = async (req, res, next) => {
    let breadcrumb = [];
    breadcrumb.push("Apprenants");
    breadcrumb.push("Tous");

    try {
        const apprenants = await User.find({ role: "apprenant" }).populate('promoId').exec();
        const promotions = await Yeargroup.find({});
        res.render('apprenants/apprenants', {
            title: "Apprenants",
            breadcrumb: breadcrumb,
            isTemplatePage: false,
            isEmargementPage: false,
            isPromotionPage: false,
            isApprenantPage: true,
            errorMessage: null,
            hasError: false,
            validationErrors: [],
            apprenants: apprenants,
            promotions: promotions
        }); 
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
}


/**
 * Get single learner informations
 *
 * @function getSpecificApprenant
 * @returns json
 */
exports.getSpecificApprenant = async (req, res, next) => {
    const learnersId = req.params.learnersId;
    try {
        const apprenant = await User.findOne({ _id: learnersId, role: "apprenant"});
        return res.status(200).json({ apprenant });
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
}

/**
 * Get all templates informations
 *
 * @function getTemplates
 * @returns {VIEW} templateAll view
 */
exports.getTemplates = async (req, res, next) => {
    let breadcrumb = [];
    breadcrumb.push("Templates");
    breadcrumb.push("Tous");

    try {
        const page       = +req.query.page || 1;
        const totalItems = await Signoffsheet.find().countDocuments();

        const templateInfo = await Template.find()
            .skip((page - 1) * ITEM_PER_PAGE)
            .limit(ITEM_PER_PAGE).sort({ createdAt: -1 });

        res.render('templates/templateAll', {
            title: "Templates",
            breadcrumb: breadcrumb,
            isTemplatePage: true,
            isEmargementPage: false,
            isPromotionPage: false,
            isApprenantPage: false,
            errorMessage: null,
            hasError: false,
            validationErrors: [],
            templateInfo: templateInfo,
            currentPage: page,
            hasNextPage: ITEM_PER_PAGE * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEM_PER_PAGE),
            total: totalItems
        });
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        next(err);
        return err;
    }
}


/**
 * Get form to add template informations
 *
 * @function getAddTemplate
 * @returns {VIEW} templateAdd view
 */
exports.getAddTemplate = (req, res, next) => {
    let breadcrumb = [];
    breadcrumb.push("Templates");
    breadcrumb.push("Ajouter");

    res.render('templates/templateAdd', {
        title: "Templates",
        breadcrumb: breadcrumb,
        isTemplatePage: true,
        isEmargementPage: false,
        isPromotionPage: false,
        isApprenantPage: false,
        errorMessage: null,
        hasError: false,
        validationErrors: []
    });
}


/**
 * Get form to edit template informations
 *
 * @function getEditTemplate
 * @returns {VIEW} templateEdit view
 */
exports.getEditTemplate = async (req, res, next) => {
    let breadcrumb = [];
    breadcrumb.push("Templates");
    breadcrumb.push("Modifications");

    const templateId = req.params.templateId;

    try {
        const templateInfo = await Template.findOne({ _id: templateId });
        res.render('templates/templateEdit', {
            title: "Templates",
            breadcrumb: breadcrumb,
            isTemplatePage: true,
            isEmargementPage: false,
            isPromotionPage: false,
            isApprenantPage: false,
            errorMessage: null,
            hasError: false,
            validationErrors: [],
            templateInfo: templateInfo
        });
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        next(err);
        return err;
    }
}


/**
 * Get all signoffsheets information with admin actions
 *
 * @function getEmargements
 * @returns {VIEW} emargementAll view
 */
exports.getEmargements = async (req, res, next) => {
    let breadcrumb = [];
    breadcrumb.push("Emargements");
    breadcrumb.push("Tous");

    try {
        const page       = +req.query.page || 1;
        const totalItems = await Signoffsheet.find().countDocuments();

        const signoffsheetPdf = await Signoffsheet.find()
            .skip((page - 1) * ITEM_PER_PAGE)
            .limit(ITEM_PER_PAGE).sort({ createdAt: -1 })
            .populate('templateId')
            .exec();

        const templates  = await Template.find({});
        const promotions = await Yeargroup.find({});

        res.render('emargements/emargementAll', {
            title: "Emargements",
            breadcrumb: breadcrumb,
            isTemplatePage: false,
            isEmargementPage: true,
            isPromotionPage: false,
            isApprenantPage: false,
            errorMessage: null,
            hasError: false,
            validationErrors: [],
            templateInfo : templates,
            promotions: promotions,
            signoffsheetData: signoffsheetPdf,
            currentPage: page,
            hasNextPage: ITEM_PER_PAGE * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEM_PER_PAGE),
            total: totalItems
        });
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        next(err);
        return err;
    }
}

/**
 * Get an iframe of signoffsheets PDF
 *
 * @function getEmargementsIframe
 * @returns {VIEW} emargementSingle view
 */
exports.getEmargementsIframe = async (req, res, next) => {
    let breadcrumb = [];
    breadcrumb.push("Emargements");
    breadcrumb.push("Détails");

    let emargementId = req.params.emargementId;

    try {
        const templates  = await Template.find({});
        const promotions = await Yeargroup.find({});
        const emargement = await Signoffsheet.findOne({_id: emargementId});

        res.render('emargements/emargementSingle', {
            title: "Emargements",
            breadcrumb: breadcrumb,
            isTemplatePage: false,
            isEmargementPage: true,
            isPromotionPage: false,
            isApprenantPage: false,
            errorMessage: null,
            hasError: false,
            validationErrors: [],
            templateInfo: templates,
            promotions: promotions,
            emargement: emargement
        });
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        next(err);
        return err;
    }
}