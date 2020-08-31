const Template      = require('../../models/templates');
const Signoffsheet  = require('../../models/signoffsheets');
const User          = require('../../models/users');
const Yeargroup     = require('../../models/users');

exports.getIndex = async (req, res, next) => {
    let breadcrumb = [];
    breadcrumb.push("Accueil");

    try {
        const signoffsheetPdf = await Signoffsheet.find().populate('templateId');
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
            signoffsheetData: signoffsheetPdf
        });
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        next(err);
        return err;
    }

}

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

exports.getTemplates = async (req, res, next) => {
    let breadcrumb = [];
    breadcrumb.push("Templates");
    breadcrumb.push("Tous");

    try {
        const templateInfo = await Template.find();
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
            templateInfo: templateInfo
        });
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        next(err);
        return err;
    }
}

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

exports.getEditTemplate = async (req, res, next) => {
    let breadcrumb = [];
    breadcrumb.push("Templates");
    breadcrumb.push("Modifications");

    const templateId = req.params.templateId;

    try {
        const templateInfo = await Template.findOne({_id: templateId});
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

exports.getEmargements = (req, res, next) => {
    let breadcrumb = [];
    breadcrumb.push("Emargements");
    breadcrumb.push("Tous");

    res.render('emargements/emargementAll', {
        title: "Emargements",
        breadcrumb: breadcrumb,
        isTemplatePage: false,
        isEmargementPage: true,
        isPromotionPage: false,
        isApprenantPage: false,
        errorMessage: null,
        hasError: false,
        validationErrors: []
    });
}

exports.getEmargementsIframe = (req, res, next) => {
    let breadcrumb = [];
    breadcrumb.push("Emargements");
    breadcrumb.push("Détails");

    let emargementId = req.params.emargementId;

    res.render('emargements/emargementSingle', {
        title: "Emargements",
        breadcrumb: breadcrumb,
        isTemplatePage: false,
        isEmargementPage: true,
        isPromotionPage: false,
        isApprenantPage: false,
        errorMessage: null,
        hasError: false,
        validationErrors: []
    });
}

exports.getPromotions = (req, res, next) => {
    let breadcrumb = [];
    breadcrumb.push("Promotions");
    breadcrumb.push("Tous");

    res.render('promotions/promotions', {
        title: "Promotions",
        breadcrumb: breadcrumb,
        isTemplatePage: false,
        isEmargementPage: false,
        isPromotionPage: true,
        isApprenantPage: false,
        errorMessage: null,
        hasError: false,
        validationErrors: []
    });
}

exports.getApprenants = (req, res, next) => {
    let breadcrumb = [];
    breadcrumb.push("Apprenants");
    breadcrumb.push("Tous");

    res.render('apprenants/apprenants', {
        title: "Apprenants",
        breadcrumb: breadcrumb,
        isTemplatePage: false,
        isEmargementPage: false,
        isPromotionPage: false,
        isApprenantPage: true,
        errorMessage: null,
        hasError: false,
        validationErrors: []
    });
}