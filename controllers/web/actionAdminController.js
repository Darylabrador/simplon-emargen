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
const QRCode                 = require('qrcode');

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


/** Handle add learner account
 * @name addAppprenant
 * @function
 * @param {string} nom
 * @param {string} prenom
 * @param {string} email
 * @param {string} promotion
 * @throws Will throw an error if one error occursed
 */
exports.addAppprenant = async (req, res, next) => {
    const { nom, prenom, email, promotion } = req.body;
    const errors = validationResult(req);

    try {
        if (!errors.isEmpty()) {
            req.flash('error', errors.array()[0].msg);
            return res.redirect('/admin/apprenants');
        }

        const secretPass = await crypto.createHmac('sha256', Date.now().toString()).update(email).digest('hex');
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


/** Handle edit learner account
 * @name editApprenant
 * @function
 * @param {string} learnerId
 * @param {string} nom
 * @param {string} prenom
 * @param {string} email
 * @param {string} promotion
 * @throws Will throw an error if one error occursed
 */
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

/** Handle reset pass for learner account
 * @name resetPassApprenant
 * @function
 * @param {string} learnerId
 * @throws Will throw an error if one error occursed
 */
exports.resetPassApprenant = async (req, res, next) => {
    const { learnerId } = req.body;

    try {
        const updatePassLearner = await User.findOne({ _id: learnerId, role: 'apprenant' });
        if (!updatePassLearner) {
            req.flash('error', "Apprenant introuvable !");
            return res.redirect('/admin/apprenants');
        }

        const secretPass   = await crypto.createHmac('sha256', Date.now().toString()).update(updatePassLearner.email).digest('hex');
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


/** Handle delete learner account
 * @name deleteApprenant
 * @function
 * @param {string} learnerId
 * @throws Will throw an error if one error occursed
 */
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
    const errors = validationResult(req);

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
    const errors = validationResult(req);

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

        updatedTemplate.name = name;
        updatedTemplate.intitule = intitule;
        updatedTemplate.organisme = organisme;
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
 * @param {string} googleSheetUrl url
 * @param {number} pageNumber sheet number's page
 * @throws Will throw an error if one error occursed
 */
exports.getDataFromSheet = async (req, res, next) => {
    const learners   = [];
    const days       = [];
    const trainers   = [];

    const { googleSheetUrl, pageNumber, template, promo } = req.body;
    const infoUrl = googleSheetUrl.split('/')[5];
    const errors = validationResult(req);

    try {
        if (!errors.isEmpty()) {
            req.flash('error', errors.array()[0].msg);
            return res.redirect('/admin/emargements');
        }

        const learner  = await User.find({ role: "apprenant", promoId: promo });
        const response = await axios.get(`https://spreadsheets.google.com/feeds/cells/${infoUrl}/${pageNumber}/public/full?alt=json`);
        const infoJson = response.data.feed.entry;

        if(learner.length == 0) {
            req.flash('error', 'La promotion est incorrecte');
            return res.redirect('/admin/emargements');
        }

        infoJson.forEach(data => {
            if (data.gs$cell.col == 1 && data.gs$cell.row != 1) {
                learner.forEach(learnerInfo => {
                    if (data.gs$cell.inputValue == learnerInfo._id){
                        let identite = `${learnerInfo.name} ${learnerInfo.surname}`;
                        learners.push(identite);
                    }
                });
            }

            if (data.gs$cell.col > 1 && data.gs$cell.col <= 6 && data.gs$cell.row == 1) {
                days.push(data.gs$cell.inputValue);
            }

            if (data.gs$cell.col > 1 && data.gs$cell.col <= 6 && data.gs$cell.row == 2) {
                trainers.push(data.gs$cell.inputValue);
            }
        });

        const signoffPDF = 'emargement-' + new Date().getTime() + '-v1.pdf';
        const createdPdf = new Signoffsheet({
            urlSheet: `https://spreadsheets.google.com/feeds/cells/${infoUrl}/${pageNumber}/public/full?alt=json`,
            name: signoffPDF,
            templateId: template,
            promoId: promo,
            timeStart: days[0],
            timeEnd: days[days.length - 1]
        });

        const newPdfFile = await createdPdf.save();

        learners.forEach(appr => {
            newPdfFile.learners.push(appr);
        })

        days.forEach(jour => {
            newPdfFile.days.push(jour);
        })

        trainers.forEach(formatr => {
            newPdfFile.trainers.push(formatr);
        })

        await newPdfFile.save();
        req.flash('success', 'La feuille d\'émargement est prête!');
        return res.redirect('/admin/emargements');
    } catch (error) {
        let errorMessage = "";

        if (error.message == "Request failed with status code 400") {
            errorMessage = "Cette feuille n'existe pas";
        } else {
            errorMessage = "Une erreur est survenue";
        }

        req.flash('error', errorMessage);
        res.redirect('/admin/emargements');
    }
}


/**
 * generate SignOff sheet PDF
 * @name generatePdf
 * @function
 * @param {string} emargementId
 * @throws Will throw an error if one error occursed
 */
exports.generatePdf = async (req, res, next) => {
    const { emargementId } = req.body;

    try {
        const versionning = await Signoffsheet.findById(emargementId);
        versionning.versionningHistory.push(versionning.name);
        await versionning.save();

        const signoffSheetData = await Signoffsheet.findById(emargementId).populate('templateId').exec();
        const logoTemplate = path.join('public', signoffSheetData.templateId.logo);
        const signoffPath = path.join('data', 'pdf', signoffSheetData.name);

        // Créer le PDF
        const doc = new PDFDocument({
            size: 'A4',
            layout: 'landscape',
            autoFirstPage: false
        });

        doc.pipe(fs.createWriteStream(signoffPath).on('close', () => {
            req.flash('success', 'La visualisation est disponible');
            res.redirect('/admin/emargements');
            doc.pipe(res);
        }));

        let xEntete           = 200;
        let yEntete           = 160;
        let xApprenant        = 30;
        let yApprenant        = 182;
        var compteurInitPlage = 0;
        var compteurFinPlage  = 5;

        for (let y = 0; y < signoffSheetData.learners.length; y++) {
            if (y % 5 == 0) {
                doc.addPage();
                pdfFunction.headerPdf(doc, logoTemplate, signoffSheetData.templateId.intitule, signoffSheetData.templateId.organisme);
                pdfFunction.corpsPdf(doc, xEntete, yEntete, xApprenant, yApprenant, signoffSheetData.days, signoffSheetData.learners, signoffSheetData.trainers, compteurInitPlage, compteurFinPlage, emargementId);
                compteurInitPlage += 5;
                compteurFinPlage += 5;
            }
        }

        doc.end();
        signoffSheetData.fileExist = true;
        await signoffSheetData.save();

        /*
 
        */
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
 * @param {string} emargementId
 * @throws Will throw an error if one error occursed
 */
exports.synchronisationToSheet = async (req, res, next) => {
    const { emargementId } = req.body;

    try {
        const synchroInfo = await Signoffsheet.findById(emargementId);
        if (!synchroInfo) {
            req.flash('error', 'La feuile d\'émargement n\'a pas été trouvé !');
            return res.redirect('/admin/emargements');
        }

        synchroInfo.learners     = [];
        synchroInfo.days         = [];
        synchroInfo.trainers     = [];
        synchroInfo.signLocation = [];
        synchroInfo.version      = synchroInfo.version + 1;
        synchroInfo.fileExist    = false;

        const dataUpdate = await synchroInfo.save();
        const learner    = await User.find({ role: "apprenant" });
        const response   = await axios.get(dataUpdate.urlSheet);
        const infoJson   = response.data.feed.entry;

        infoJson.forEach(data => {
            if (data.gs$cell.col == 1 && data.gs$cell.row != 1) {
                learner.forEach(learnerInfo => {
                    if (data.gs$cell.inputValue == learnerInfo._id) {
                        let identite = `${learnerInfo.name} ${learnerInfo.surname}`;
                        dataUpdate.learners.push(identite);
                    }
                });
            }

            if (data.gs$cell.col > 1 && data.gs$cell.col <= 6 && data.gs$cell.row == 1) {
                dataUpdate.days.push(data.gs$cell.inputValue);
            }

            if (data.gs$cell.col > 1 && data.gs$cell.col <= 6 && data.gs$cell.row == 2) {
                dataUpdate.trainers.push(data.gs$cell.inputValue);
            }
        });

        const pdfname = dataUpdate.name.split('-')[1];
        const signoffPDF = 'emargement-' + pdfname + '-v' + synchroInfo.version + '.pdf';
        dataUpdate.name = signoffPDF;
        await dataUpdate.save();

        req.flash('success', 'Synchronisation effectuée !');
        return res.redirect('/admin/emargements');
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
}

/**
 * Generate limited user interaction to sign signoffsheet pdf
 * @name generateSign
 * @function
 * @param {string} emargementId
 * @param {string} signDate
 * @param {string} creneau
 * @throws Will throw an error if one error occursed
 */
exports.generateSign = async (req, res, next) => {
    const { emargementId, signDate, creneau } = req.body;

    try {
        // store data before resetting
        const generalSign = await Signoffsheet.findById(emargementId);
        const generalSignArray = generalSign.signLocation;
        const promotion = generalSign.promoId;

        if (generalSign.learners.length != generalSignArray.length) {
            // reset the document
            const sign = await Signoffsheet.findById(emargementId);
            sign.signLocation = [];
            await sign.save();

            // iterate to get coordinates
            let arrayTest = [];
            generalSignArray.forEach((element) => {
                for (let a = 0; a < element.length; a++) {
                    if (element[a + 1]) {
                        if (element[a][0] != element[a + 1][0]) {
                            arrayTest.push(element[a])
                            generalSignArray.push(arrayTest)
                            arrayTest = [];
                        } else {
                            arrayTest.push(element[a])
                        }
                    } else {
                        arrayTest.push(element[a]);
                        generalSignArray.push(arrayTest)
                        arrayTest = [];
                    }
                }
            });
            await generalSign.save();
        }
    
        const dateSearchedOld = signDate.split('-');
        const dateSearchedNew = `${dateSearchedOld[2]}/${dateSearchedOld[1]}/${dateSearchedOld[0]}`;
        const dayExist = generalSign.days.find(element => element == dateSearchedNew);
        if (!dayExist) {
            req.flash('error', 'Le jour est incorrecte');
            return res.redirect('/admin/emargements');
        }

        const assignCount = await Assign.find({ signoffsheetId: emargementId}).countDocuments();
        const assignList  = await Assign.find({ signoffsheetId: emargementId });
        if (assignCount != 0) {
            assignList.forEach(element => {
                element.deleteOne()
            })
        } 

        const learnerList = await User.find({ promoId: promotion, role: 'apprenant' });
        
        learnerList.forEach(learnerInfo => {
            // let link = req.protocol + '://' + req.get('host') + `/api/emargements/signature?apprenant=${learnerInfo._id}&jour=${signDate}&creneau=${creneau}`;
            let link = req.protocol + '://' + '192.168.1.15:3000' + `/api/emargements/signature?apprenant=${learnerInfo._id}&jour=${signDate}&creneau=${creneau}`;
        
            QRCode.toDataURL(link)
                .then(url => {

                    let qrcodeData = url.replace(/^data:image\/\w+;base64,/, "");

                    const openSign = new Assign({
                        userId: learnerInfo._id,
                        signoffsheetId: emargementId,
                        qrcode: qrcodeData,
                        signLink: link
                    });

                    openSign.save();

                    transporter.sendMail({
                        attachments: [{ 
                            filename: 'qrcode.png',
                            content: new Buffer.from(qrcodeData, 'base64')
                        }],
                        to: learnerInfo.email,
                        from: `${process.env.EMAIL_USER}`,
                        subject: `QRcode : Signature ${signDate}`,
                        html: `
                        <p> Vous avez 10 minutes pour signer la feuille d'émargement en scannant le QRcode suivant via l'application SIMPLON </p>
                        <p> Vos identifiants sont valides uniquement sur l'application mobile. En cas d'oublie du mot de passe, il faut vous adresser à l'administration de Simplon</p>
                        `
                    });
                })
                .catch(err => {
                    req.flash('error', 'Le QR code n\'a pas pu être générer');
                    return res.redirect('/admin/emargements');
                })
        });
     
        req.flash('success', 'Les apprenants ont 10min pour signé');
        res.redirect('/admin/emargements');
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
}