
exports.getLogin = (req, res, next) =>{
    res.render('auth/login', {
        title: "Connexion"
    });
}

exports.getReinitialisation = (req, res, next) => {
    res.render('auth/resetPass', {
        title: "Réinitialisation",
        isReset: false
    });
}

exports.getReinitialisationToken = (req, res, next) => {
    const resetToken = req.params.resetToken;
    console.log(resetToken);
    
    res.render('auth/resetPass', {
        title: "Réinitialisation",
        isReset: true
    });
}