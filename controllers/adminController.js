const fs          = require('fs');
const path        = require('path');

const PDFDocument = require('pdfkit');

const { validationResult } = require('express-validator');
const axios                = require('axios');

const Template           = require('../models/template');
const Signoffsheet       = require('../models/signoffsheet');

const { deleteFile } = require('../utils/file');
const pdfFunction = require('../utils/pdfGenerator');

/** get admin dashboard
 * @name getDashboard
 * @function
 * @throws Will throw an error if one error occursed
 */
exports.getDashboard = async (req, res, next) => {
    try {
        const templateInfo    = await Template.find();
        const signoffsheetPdf = await Signoffsheet.find().populate('templateId');

        res.render('emargements/index', {
            title: 'Dashboard',
            path: '/dashboard',
            errorMessage: null,
            page: "dashboard",
            templateInfo: templateInfo,
            signoffsheetData: signoffsheetPdf
        });

    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
};


/** get all templates
 * @name getAllTemplate
 * @function
 * @throws Will throw an error if one error occursed
 */
exports.getAllTemplate = async (req, res, next) => {
    try {
        const templateInfo = await Template.find();
        res.render('emargements/templates', {
            title: 'Templates',
            path: '/templates',
            errorMessage: null,
            page: "templates",
            templateInfo: templateInfo
        });

    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
};



/** get specific templates
 * @name getSpecificTemplate
 * @function
 * @throws Will throw an error if one error occursed
 */
exports.getSpecificTemplate = async (req, res, next) => {
    const templateId = req.params.templateId;

    try {
        const template       = await Template.find();
        const templateSingle = await Template.findById(templateId);
    
        res.render('emargements/editTemplate', {
            title: 'Modification template',
            path: '/templates',
            errorMessage: null,
            page: "templates",
            templateInfo: template,
            templateSingle: templateSingle
        });

    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
};


/** Handle post add template
 * @name addtemplate
 * @function
 * @param {string} nom
 * @param {string} intitule
 * @param {string} organisme
 * @param image logo de l'organisme
 * @throws Will throw an error if one error occursed
 */
exports.addtemplate = async (req, res, next) => {
    const { name, intitule, organisme } = req.body;
    const imageFile = req.file;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.json({
            success: false,
            message: errors.array()[0].msg
        });
    }

    if (!imageFile) {
        return res.json({
            success: false,
            message: 'Veuillez ajouter un logo'
        });
    }

    const imageUploaded = imageFile.path.replace("\\", "/"); // uniquement sous windows
    const image = imageFile.path.split('public')[1];

    try {
        const newTemplate = new Template({
            name: name,
            intitule: intitule,
            organisme: organisme,
            logo: image
        });

        await newTemplate.save();

        return res.json({
            success: true,
            message: 'Le template a bien été ajouté'
        });

    } catch (error) {
        return res.json({
            success: false,
            message: 'Une erreur est survenue lors de l\'ajout du template'
        });
    }
};


/** get update specific template
 * @name updateTemplate
 * @function
 * @throws Will throw an error if one error occursed
 */
exports.updateTemplate = async (req, res, next) => {
    const { templateId, nameUpdate, organismeUpdate, intituleUpdate} = req.body;
    const logoUpdate = req.file;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash('error', errors.array()[0].msg);
        return res.redirect(`/admin/template/${templateId}`);
    }

    try {
        const updatedTemplate = await Template.findById(templateId);

        if (!updatedTemplate){
            req.flash('error', 'Le template n\'a pas été trouvé');
            return res.redirect(`/admin/templates`);
        }

        if (logoUpdate) {
            const oldLogoDelete = 'public/' + updatedTemplate.logo;
            deleteFile(oldLogoDelete);
            const newLogoUploaded = logoUpdate.path.replace("\\", "/"); // uniquement sous windows
            const newLogo         = logoUpdate.path.split('public')[1];
            updatedTemplate.logo  = newLogo;
        }

        updatedTemplate.name      = nameUpdate;
        updatedTemplate.intitule  = intituleUpdate;
        updatedTemplate.organisme = organismeUpdate;
        await updatedTemplate.save();

        req.flash('success', 'Mise à jour effectuée !');
        return res.redirect('/admin/templates');

    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
};


/** Delete specific template
 * @name deleteTemplate
 * @function
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
 * @param {object} template
 * @param {string} dataSheetUrl
 * @throws Will throw an error if one error occursed
 */
exports.getDataFromSheet = async (req, res, next) => {
    const apprenants     = [];
    const joursFormation = [];
    const formateur      = [];

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.json({
            success: false,
            message: errors.array()[0].msg
        });
    }

    const { template, dataSheet } = req.body;
    const infoUrl = dataSheet.split('/')[5];

    try {
        const response = await axios.get(`https://spreadsheets.google.com/feeds/cells/${infoUrl}/1/public/full?alt=json`); 
        const infoJson = response.data.feed.entry;

        infoJson.forEach(data => {
            if (data.gs$cell.col == 1 && data.gs$cell.row != 1){
                apprenants.push(data.gs$cell.inputValue);
            }

            if (data.gs$cell.col != 1 && data.gs$cell.row == 1) {
                joursFormation.push(data.gs$cell.inputValue);
            }

            if (data.gs$cell.col != 1 && data.gs$cell.row == 2){
                formateur.push(data.gs$cell.inputValue);
            }
        });

        const templateInfo = await Template.findById(template);
        const signoffPDF   = 'emargement-' + new Date().getTime() + '-v1.pdf';

        // stock data
        const createdPdf = new Signoffsheet({
            urlSheet: `https://spreadsheets.google.com/feeds/cells/${infoUrl}/1/public/full?alt=json`,
            name: signoffPDF,
            templateId: templateInfo._id,
            periodeDebut: joursFormation[0],
            periodeFin: joursFormation[joursFormation.length - 1]
        });

        const newPdfFile = await createdPdf.save();

        apprenants.forEach(appr =>{
            newPdfFile.apprenants.push(appr);
        })

        joursFormation.forEach(jour =>{
            newPdfFile.jours.push(jour);
        })
       
        formateur.forEach(formatr =>{
            newPdfFile.formateur.push(formatr);
        })

        await newPdfFile.save();

        res.json({
            success: true,
            message: "La feuille d'émargement est prête !"
        });

    } catch (error) {
        res.json({
            success: false,
            message: "Une erreur est survenue lors de la génération du PDF !"
        });
        return error;
    }
};


/**
 * Synchronise Google Sheet and our app Sign-off Sheet
 * @param {string} signoffId 
 */
exports.synchronisationToSheet = async (req, res, next) => {
    const { signoffId } = req.body;

    try {
        const synchroInfo = await Signoffsheet.findById(signoffId);

        if (!synchroInfo) {
            req.flash('error', 'La feuile d\'émargement n\'a pas été trouvé !');
            return res.redirect('/admin/dashboard');
        }

        synchroInfo.apprenants = [];
        synchroInfo.jours      = [];
        synchroInfo.formateur  = [];

        synchroInfo.version   = synchroInfo.version + 1;
        synchroInfo.fileExist = false;

        const dataUpdate = await synchroInfo.save();

        const response = await axios.get(dataUpdate.urlSheet);
        const infoJson = response.data.feed.entry;

        infoJson.forEach(data => {
            if (data.gs$cell.col == 1 && data.gs$cell.row != 1) {
                dataUpdate.apprenants.push(data.gs$cell.inputValue);
            }

            if (data.gs$cell.col != 1 && data.gs$cell.row == 1) {
                dataUpdate.jours.push(data.gs$cell.inputValue);
            }

            if (data.gs$cell.col != 1 && data.gs$cell.row == 2) {
                dataUpdate.formateur.push(data.gs$cell.inputValue);
            }
        });

        const pdfname = dataUpdate.name.split('-')[1];
        const signoffPDF = 'emargement-' + pdfname + '-v' + synchroInfo.version +'.pdf';
        dataUpdate.name = signoffPDF;

        await dataUpdate.save();
        
        req.flash('success', 'Synchronisation effectuée !');
        return res.redirect('/admin/dashboard');

    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
}


/**
 * generate SignOff sheet PDF
 * @param {string} signoffId 
 */
exports.generatePdf = async (req, res, next) => {
    const signoffId = req.params.signoffId;

    try {
        const signoffSheetData = await Signoffsheet.findById(signoffId).populate('templateId').exec();
        const logoTemplate = path.join('public', signoffSheetData.templateId.logo);
        const signoffPath  = path.join('data', 'pdf', signoffSheetData.name);

        // Créer le PDF
        const doc = new PDFDocument({
            size: 'A4',
            layout: 'landscape',
            autoFirstPage: false
        });

        doc.pipe(fs.createWriteStream(signoffPath).on('close', () => {
            res.redirect('/admin/dashboard');
            doc.pipe(res);
        }));
       

        let xEntete = 200;
        let yEntete = 160;
        let xApprenant = 30;
        let yApprenant = 182;

        var compteurInitPlage = 0;
        var compteurFinPlage = 5;

        for (let y = 0; y < signoffSheetData.apprenants.length; y++) {
            if (y % 5 == 0) {
                doc.addPage();
                pdfFunction.headerPdf(doc, logoTemplate, signoffSheetData.templateId.intitule, signoffSheetData.templateId.organisme);
                pdfFunction.corpsPdf(doc, xEntete, yEntete, xApprenant, yApprenant, signoffSheetData.jours, signoffSheetData.apprenants, signoffSheetData.formateur, compteurInitPlage, compteurFinPlage);
                compteurInitPlage += 5;
                compteurFinPlage += 5;
            }
        }
        doc.end();

        signoffSheetData.fileExist = true;
        await signoffSheetData.save();

    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err); 
    }
}

