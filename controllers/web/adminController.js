exports.getIndex = (req, res, next) => {
    let breadcrumb = [];
    breadcrumb.push("Accueil");

    res.render('index', {
        title: "Accueil",
        breadcrumb: breadcrumb
    });
}

exports.getGeneralSettings = (req, res, next) => {
    let breadcrumb = [];
    breadcrumb.push("Réglages");
    breadcrumb.push("Compte");

    res.render('account/settings', {
        title: "Compte",
        breadcrumb: breadcrumb
    });
}

exports.getInformationSettings = (req, res, next) => {
    let breadcrumb = [];
    breadcrumb.push("Réglages");
    breadcrumb.push("Compte");
    breadcrumb.push("Informations");

    res.render('account/informations', {
        title: "Compte",
        breadcrumb: breadcrumb
    });
}

exports.getPasswordSettings = (req, res, next) => {
    let breadcrumb = [];
    breadcrumb.push("Réglages");
    breadcrumb.push("Compte");
    breadcrumb.push("Mot de passe");

    res.render('account/password', {
        title: "Compte",
        breadcrumb: breadcrumb
    });
}