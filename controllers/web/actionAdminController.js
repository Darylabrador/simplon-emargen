const fs          = require('fs');
const path        = require('path');
const PDFDocument = require('pdfkit');

const { validationResult } = require('express-validator');
const axios                = require('axios');
const bcrypt               = require('bcryptjs');
const nodemailer           = require('nodemailer');
const sengridTransport     = require('nodemailer-sendgrid-transport');
const dotenv               = require('dotenv').config();
const crypto               = require('crypto');

const { deleteFile } = require('../../utils/file');
const pdfFunction    = require('../../utils/pdfGenerator');

const User           = require('../../models/users');
const Yeargroup      = require('../../models/yeargroups');
const Template       = require('../../models/templates');
const Signoffsheet   = require('../../models/signoffsheets');
const Assign         = require('../../models/assigns');

// Send mail configuration
const transporter = nodemailer.createTransport(sengridTransport({
    auth: {
        api_key: `${process.env.API_KEY}`
    }
}));

/** Handle edit information's account
 * @name postEditInformations
 * @function
 * @param {string} currentuserId
 * @param {string} name
 * @param {string} surname
 * @param {string} email
 * @throws Will throw an error if one error occursed
 */
exports.postEditInformations = async (req, res, next) => {
    const { currentuserId, name, surname, email } = req.body;
    const errors = validationResult(req);

    try {
        if (!errors.isEmpty()) {
            let breadcrumb = [];
            breadcrumb.push("Réglages");
            breadcrumb.push("Compte");
            breadcrumb.push("Informations");
            
            return res.status(422).render('account/informations', {
                title: "Compte",
                path: '',
                hasError: true,
                isTemplatePage: false,
                isEmargementPage: false,
                isPromotionPage: false,
                isApprenantPage: false,
                breadcrumb: breadcrumb,
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array(),
                userInfo: null,
                oldInput: { name, surname, email }
            });
        }
        
        const userEdited   = await User.findOne({_id: currentuserId });
        userEdited.name    = name.toUpperCase();
        userEdited.surname = surname.charAt(0).toUpperCase() + surname.slice(1);
        userEdited.email   = email;
        await userEdited.save(); 

        req.flash('success', 'Mise à jour effectuée');
        res.redirect('/admin/settings/informations');

    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        next(err);
        return err;
    }
}

/** Handle edit password's account
 * @name postEditPassword
 * @function
 * @param {string} currentuserId
 * @param {string} oldpass
 * @param {string} newpass
 * @throws Will throw an error if one error occursed
 */
exports.postEditPassword = async (req, res, next) => {
    const { currentuserId, oldpass, newpass } = req.body;
    const errors = validationResult(req);

    try {
        if (!errors.isEmpty()) {
            let breadcrumb = [];
            breadcrumb.push("Réglages");
            breadcrumb.push("Compte");
            breadcrumb.push("Mot de passe");

            return res.status(422).render('account/password', {
                title: "Compte",
                isTemplatePage: false,
                isEmargementPage: false,
                isPromotionPage: false,
                isApprenantPage: false,
                breadcrumb: breadcrumb,
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array()
            });
        }

        const userEdited = await User.findOne({ _id: currentuserId });
        const isEqual    = await bcrypt.compare(oldpass, userEdited.password);

        if(!userEdited) {
            req.flash('error', 'une erreur est survenue');
            return res.redirect('/admin/settings/password');
        }

        if (!isEqual) {
            req.flash('error', 'Ce n\'est pas votre ancien mot de passe');
            return res.redirect('/admin/settings/password');
        }

        const hashedPwd = await bcrypt.hash(newpass, 12);
        userEdited.password = hashedPwd;
        await userEdited.save();

        req.flash('success', 'Mise à jour effectuée');
        return res.redirect('/admin/settings/password');
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        next(err);
        return err;
    }
}

/** Handle add template
 * @name addTemplate
 * @function
 * @param {string} name
 * @param {string} intitule
 * @param {string} organisme
 * @param logo Logo de l'organisme
 * @throws Will throw an error if one error occursed
 */
exports.addTemplate = async (req, res, next) => {
    const { name, intitule, organisme } = req.body;
    const imageFile = req.file;
    const errors    = validationResult(req);

    console.log(req.file);

    try {
        if (!errors.isEmpty()) {
            let breadcrumb = [];
            breadcrumb.push("Templates");
            breadcrumb.push("Ajouter");

            res.status(422).render('templates/templateAdd', {
                title: "Templates",
                breadcrumb: breadcrumb,
                isTemplatePage: true,
                isEmargementPage: false,
                isPromotionPage: false,
                isApprenantPage: false,
                hasError: true,
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array(),
                oldInput: { name, intitule, organisme }
            });
        }

        if (!imageFile) {
            req.flash('error', "Obligatoire : Image du logo");
            return res.redirect('/admin/templates/add');
        }

        const imageUploaded = imageFile.path.replace("\\", "/"); // only with window
        const image = imageFile.path.split('public')[1];

        const newTemplate = new Template({
            name: name,
            intitule: intitule,
            organisme: organisme,
            logo: image
        });

        await newTemplate.save();
        req.flash('success', "Template ajouté avec succès");
        res.redirect('/admin/templates');
    
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        next(err);
        return err;
    }
}

/** Handle edit template
 * @name editTemplate
 * @function
 * @param {string} name
 * @param {string} intitule
 * @param {string} organisme
 * @param logo Logo de l'organisme
 * @throws Will throw an error if one error occursed
 */
exports.editTemplate = async (req, res, next) => {
    const { templateId, name, intitule, organisme } = req.body;
    const imageFile = req.file;
    const errors    = validationResult(req);

    try {
        const updatedTemplate = await Template.findById(templateId);

        if (!errors.isEmpty()) {
            let breadcrumb = [];
            breadcrumb.push("Templates");
            breadcrumb.push("Modifications");

            return res.status(422).render('templates/templateEdit', {
                title: "Templates",
                breadcrumb: breadcrumb,
                isTemplatePage: true,
                isEmargementPage: false,
                isPromotionPage: false,
                isApprenantPage: false,
                hasError: true,
                templateInfo: null,
                errorMessage: errors.array()[0].msg,
                validationErrors: errors.array(),
                oldInput: { name, intitule, organisme, logo: updatedTemplate.logo, templateId }
            });
        }

        if (!updatedTemplate) {
            req.flash('error', 'Le template n\'a pas été trouvé');
            return res.redirect(`/admin/templates`);
        }

        if (imageFile) {
            const oldLogoDelete = 'public/' + updatedTemplate.logo;
            deleteFile(oldLogoDelete);
            const newLogoUploaded = imageFile.path.replace("\\", "/"); // uniquement sous windows
            const newLogo = imageFile.path.split('public')[1];
            updatedTemplate.logo = newLogo;
        }

        updatedTemplate.name        = name;
        updatedTemplate.intitule    = intitule;
        updatedTemplate.organisme   = organisme;
        await updatedTemplate.save();

        req.flash('success', 'Mise à jour effectuée !');
        return res.redirect('/admin/templates');
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        next(err);
        return err;
    }
}


/** Delete specific template
 * @name deleteTemplate
 * @function
 * @param {number} templateId
 * @throws Will throw an error if one error occursed
 */
exports.deleteTemplate = async (req, res, next) => {
    const { templateId } = req.body;

    try {
        const deletedTemplate = await Template.findById(templateId);

        if (!deletedTemplate) {
            req.flash('error', 'Le template n\'a pas été trouvé');
            return res.redirect(`/admin/templates`);
        }

        const deletedLogo = 'public/' + deletedTemplate.logo;
        deleteFile(deletedLogo);

        await deletedTemplate.deleteOne();

        req.flash('success', 'Template supprimé !');
        return res.redirect('/admin/templates');

    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
};


/** handle post generated pdf
 * @name getDataFromSheet
 * @function
 * @param {object} template template (logo etc.)
 * @param {string} dataSheet url
 * @param {number} number sheet number's page
 * @throws Will throw an error if one error occursed
 */
exports.getDataFromSheet = async (req, res, next) => {

    try {

    } catch (error) {
        let errorMessage = "";

        if (error.message == "Request failed with status code 400") {
            errorMessage = "Cette feuille n'existe pas";
        } else {
            errorMessage = "Une erreur est survenue";
        }

        res.json({
            success: false,
            message: errorMessage
        });
        return error;
    }
}


/**
 * generate SignOff sheet PDF
 * @name generatePdf
 * @function
 * @param {string} signoffId
 * @throws Will throw an error if one error occursed
 */
exports.generatePdf = async (req, res, next) => {

    try {

    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
}


/**
 * Synchronise Google Sheet and our app Sign-off Sheet
 * @name synchronisationToSheet
 * @function
 * @param {string} signoffId
 * @throws Will throw an error if one error occursed
 */
exports.synchronisationToSheet = async (req, res, next) => {

    try {

    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
}


/**
 * Add promotion
 * @name addPromotion
 * @function
 * @param {string} promotion
 * @throws Will throw an error if one error occursed
 */
exports.addPromotion = async (req, res, next) => {
    const { promotion } = req.body;
    const errors = validationResult(req);
    try {
        if (!errors.isEmpty()) {
            req.flash('error', errors.array()[0].msg);
            return res.redirect('/admin/promotions');
        }
        const newPromotion = new Yeargroup({
            label: promotion
        });
        await newPromotion.save();
        req.flash('success', 'Promotion ajouté !');
        return res.redirect('/admin/promotions');
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
}


/**
 * Edit promotion
 * @name editPromotion
 * @function
 * @param {string} promotion
 * @param {string} promotionId
 * @throws Will throw an error if one error occursed
 */
exports.editPromotion = async (req, res, next) => {
    const { promotionId, promotionUpdate } = req.body;
    const errors = validationResult(req);

    try {
        if (!errors.isEmpty()) {
            req.flash('error', errors.array()[0].msg);
            return res.redirect('/admin/promotions');
        }

        const promotions = await Yeargroup.findOne({ _id: promotionId });
        if(!promotions){
            req.flash('error', 'Promotion introuvable !');
            return res.redirect('/admin/promotions');
        }

        promotions.label = promotionUpdate;
        await promotions.save();
        req.flash('success', 'Mise à jour effectuée !');
        return res.redirect('/admin/promotions');

    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
}


/**
 * delete promotion
 * @name deletePromotion
 * @function
 * @param {string} promotionId
 * @throws Will throw an error if one error occursed
 */
exports.deletePromotion = async (req, res, next) => {
    const { promotionId } = req.body;

    try {
        const oldpromo = await Yeargroup.findOne({ _id: promotionId });
        if(!oldpromo) {
            req.flash('error', 'Promotion introuvable !');
            return res.redirect('/admin/promotions');
        }
        await oldpromo.deleteOne();
        req.flash('success', 'Promotion supprimer !');
        return res.redirect('/admin/promotions');

    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
}


exports.addAppprenant = async (req, res, next) => {
    const { nom, prenom, email, promotion } = req.body;
    const errors = validationResult(req);

    try {
        if (!errors.isEmpty()) {
            req.flash('error', errors.array()[0].msg);
            return res.redirect('/admin/apprenants');
        }

        const secretPass = await crypto.createHmac('sha256', 'm0MZyY48Ix9').update(email).digest('hex');
        const password   = secretPass.slice(0, 10);
        const hashedPwd  = await bcrypt.hash(password, 12);

        const newLearner = new User({
            promoId: promotion,
            name: nom,
            surname: prenom,
            email: email,
            password: hashedPwd
        });
        await newLearner.save();

        await transporter.sendMail({
            to: email,
            from: `${process.env.EMAIL_USER}`,
            subject: 'Compte application emargement',
            html: `<p>
                    Un compte a été créé sur l'application d'émargement de Simplon. <br> <br> 
                    Vous trouverez ci-dessous vos identifiants de connexion: <br><br> 
                    Identifiant  : ${email} <br>
                    Mot de passe : ${password}
                </p>
                <br> 
                <p> Vos identifiants sont valides uniquement sur l'application mobile. En cas d'oublie du mot de passe, il faut vous adresser à l'administration de Simplon</p>`
        });

        req.flash('success', "Compte apprenant créer avec succès");
        return res.redirect('/admin/apprenants');
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
}


exports.editApprenant = async (req, res, next) => {
    const { learnerId, nom, prenom, email, promotion } = req.body;
    const errors = validationResult(req);

    try {
        if (!errors.isEmpty()) {
            req.flash('error', errors.array()[0].msg);
            return res.redirect('/admin/apprenants');
        }

        const apprenantEdit = await User.findOne({_id: learnerId, role: 'apprenant'});
        if(!apprenantEdit) {
            req.flash('error', "Apprenant introuvable !");
            return res.redirect('/admin/apprenants');
        }

        apprenantEdit.promoId = promotion;
        apprenantEdit.name = nom;
        apprenantEdit.surname = prenom;
        apprenantEdit.email = email;
        await apprenantEdit.save();

        req.flash('success', "Compte apprenant mis à jour !");
        return res.redirect('/admin/apprenants');
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
}

exports.resetPassApprenant = async (req, res, next) => {
    const { learnerId } = req.body;

    try {
        const updatePassLearner = await User.findOne({ _id: learnerId, role: 'apprenant' });
        if (!updatePassLearner) {
            req.flash('error', "Apprenant introuvable !");
            return res.redirect('/admin/apprenants');
        }

        const secretPass   = await crypto.createHmac('sha256', 'm0MZyY48Ix9').update(updatePassLearner.email).digest('hex');
        const newPassword  = secretPass.slice(0, 10);
        const newHashedPwd = await bcrypt.hash(newPassword, 12);
        updatePassLearner.password = newHashedPwd;
        updatePassLearner.firstConnection = true;
        await updatePassLearner.save();

        await transporter.sendMail({
            to: updatePassLearner.email,
            from: `${process.env.EMAIL_USER}`,
            subject: 'Réinitialisation du mot de passe',
            html: `<p>
                    Votre mot de passe a été réinitialisé par l'administration de simplon. <br> <br> 
                    Vous trouverez ci-dessous le nouveau identifiant : <br><br> 
                    Mot de passe : ${newPassword}
                </p>
                <br> 
                <p> Vos identifiants sont valides uniquement sur l'application mobile. En cas d'oublie du mot de passe, il faut vous adresser à l'administration de Simplon</p>`
        });

        req.flash('success', "Mot de passe mis à jour !");
        return res.redirect('/admin/apprenants');
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
}


exports.deleteApprenant = async (req, res, next) => {
    const { learnerId } = req.body;
    try {
        const learner = await User.findById(learnerId);
        if(!learner){
            req.flash('error', 'Apprenant introuvable');
            res.redirect('/admin/apprenants');
        }
        await learner.deleteOne();
        req.flash('success', 'Suppression effectué avec succès');
        res.redirect('/admin/apprenants');
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
}