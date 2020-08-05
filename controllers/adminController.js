const fs          = require('fs');
const path        = require('path');

const PDFDocument = require('pdfkit');

const { validationResult } = require('express-validator');
const axios                = require('axios');

const Template     = require('../models/template');
const Signoffsheet = require('../models/signoffsheet');

const pdfFunction = require('../utils/pdfGenerator');

/** get admin dashboard
 * @name getDashboard
 * @function
 * @throws Will throw an error if one error occursed
 */
exports.getDashboard = async (req, res) => {
    try {

        const templateInfo = await Template.find();

        res.render('index', {
            title: 'Dashboard',
            path: '/dashboard',
            errorMessage: null,
            page: "",
            templateInfo: templateInfo
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
exports.addtemplate = async (req, res) => {
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
            message: 'Une erreur est survenue lors de l\'ajout du nouveau template'
        });
    }
};


/** handle post generated pdf
 * @name postSignOffShettPdf
 * @function
 * @param {object} template
 * @param {string} dataSheetUrl
 * @throws Will throw an error if one error occursed
 */
exports.postSignOffShettPdf = async (req, res, next) => {
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
        const signoffPDF   = 'emargement-' + new Date().getTime() + '.pdf';
        const signoffPath  = path.join('data', 'pdf', signoffPDF);

        // stock data
        const createdPdf = new Signoffsheet({
            name: signoffPDF,
            templateId: templateInfo._id
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

        
        // Créer le PDF
        const doc = new PDFDocument({
            size: 'A4',
            layout: 'landscape',
            autoFirstPage: false
        });

        const imageUpl = 'public/' + templateInfo.logo;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="' + signoffPDF + '"');

        doc.pipe(fs.createWriteStream(signoffPath).on("close", () => {
            res.json({
                success: true,
                message: "Vous pouvez à présent consulter le PDF !"
            });
            doc.pipe(res);
        }));

        let xEntete    = 200;
        let yEntete    = 160;
        let xApprenant = 30;
        let yApprenant = 182;

        var compteurInitPlage = 0;
        var compteurFinPlage  = 5;

        for(let y = 0; y < apprenants.length; y++){
            if(y % 5 == 0) {
                doc.addPage();
                pdfFunction.headerPdf(doc, imageUpl, templateInfo.intitule, templateInfo.organisme);
                pdfFunction.corpsPdf(doc, xEntete, yEntete, xApprenant, yApprenant, joursFormation, apprenants, formateur, compteurInitPlage, compteurFinPlage);
                compteurInitPlage += 5;
                compteurFinPlage  += 5;
            } 
        }

        doc.end();

    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Une erreur est survenue lors de la génération du PDF !"
        });
        return error;
    }
};