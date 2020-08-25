exports.getIndex = (req, res, next) => {
    let breadcrumb = [];
    breadcrumb.push("Accueil");

    res.render('index', {
        title: "Accueil",
        breadcrumb: breadcrumb
    });
}