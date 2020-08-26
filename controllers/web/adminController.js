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