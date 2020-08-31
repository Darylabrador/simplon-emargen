const fs          = require('fs');
const path        = require('path');
const PDFDocument = require('pdfkit');

const { validationResult } = require('express-validator');
const axios                = require('axios');
const bcrypt               = require('bcryptjs');

const { deleteFile } = require('../../utils/file');
const pdfFunction    = require('../../utils/pdfGenerator');

const User           = require('../../models/users');
const Yeargroup      = require('../../models/users');
const Template       = require('../../models/templates');
const Signoffsheet   = require('../../models/signoffsheets');
const Assign         = require('../../models/assigns');

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