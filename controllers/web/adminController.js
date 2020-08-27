exports.getIndex = (req, res, next) => {
    let breadcrumb = [];
    breadcrumb.push("Accueil");

    res.render('index', {
        title: "Accueil",
        breadcrumb: breadcrumb,
        isTemplatePage: false,
        isEmargementPage: false,
        isPromotionPage: false,
        isApprenantPage: false
    });
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
        isApprenantPage: false
    });
}

exports.getInformationSettings = (req, res, next) => {
    let breadcrumb = [];
    breadcrumb.push("Réglages");
    breadcrumb.push("Compte");
    breadcrumb.push("Informations");

    res.render('account/informations', {
        title: "Compte",
        breadcrumb: breadcrumb,
        isTemplatePage: false,
        isEmargementPage: false,
        isPromotionPage: false,
        isApprenantPage: false
    });
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
        isApprenantPage: false
    });
}

exports.getTemplates = (req, res, next) => {
    let breadcrumb = [];
    breadcrumb.push("Templates");
    breadcrumb.push("Tous");

    res.render('templates/templateAll', {
        title: "Templates",
        breadcrumb: breadcrumb,
        isTemplatePage: true,
        isEmargementPage: false,
        isPromotionPage: false,
        isApprenantPage: false
    });
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
        isApprenantPage: false
    });
}

exports.getEditTemplate = (req, res, next) => {
    let breadcrumb = [];
    breadcrumb.push("Templates");
    breadcrumb.push("Modifications");

    let templateId = req.params.templateId;

    res.render('templates/templateEdit', {
        title: "Templates",
        breadcrumb: breadcrumb,
        isTemplatePage: true,
        isEmargementPage: false,
        isPromotionPage: false,
        isApprenantPage: false
    });
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
        isApprenantPage: false
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
        isApprenantPage: false
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
        isApprenantPage: false
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
        isApprenantPage: true
    });
}