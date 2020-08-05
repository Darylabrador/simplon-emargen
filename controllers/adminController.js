const fs          = require('fs');
const path        = require('path');

const PDFDocument = require('pdfkit');

const { validationResult } = require('express-validator');
const axios                = require('axios');

const Template     = require('../models/template');
const Signoffsheet = require('../models/signoffsheet');

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
        const signoffPDF = 'emargement-' + new Date().getTime() + '.pdf';
        const signoffPath = path.join('data', 'pdf', signoffPDF);

        const imageUpl = 'public/' + templateInfo.logo;

        const doc = new PDFDocument({
            size: 'A4',
            layout: 'landscape'
        });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="' + signoffPDF + '"');

        doc.pipe(fs.createWriteStream(signoffPath));
        doc.pipe(res);

        doc.image(imageUpl, 60, 50, {width: 150});
        doc.fontSize(14);
        doc
            .font('Helvetica-Bold')
            .text('FEUILLE D\'EMARGEMENT -> PERIODE DE FORMATION', 230, 65);

        doc.fontSize(8)

        doc
            .font('Helvetica-Bold')
            .text(`Intitulé : ${templateInfo.intitule}`);

        doc
            .font('Helvetica-Bold')
            .text(`Organisme de formation : `);

        doc
            .font('Helvetica')
            .text(templateInfo.organisme, 340, 92);
    
        let xEntete = 200;
        let yEntete = 160;
        
        joursFormation.forEach(jour =>{
            // La date
            doc.lineJoin('miter')
                .rect(xEntete, yEntete, 120, 22)
                .stroke()
                .font('Helvetica-Bold')
                .text(`Le ${jour}`, xEntete + 30, yEntete + 8);
                xEntete += 120; // pour décalage par rapport à la largeur

        });

        let xApprenant = 30;
        let yApprenant = 182;

        doc.lineJoin('miter')
            .rect(xApprenant, yApprenant, 170, 30)
            .stroke()
            .font('Helvetica-Bold')
            .text(`NOM PRENOM Apprenant`, 60, 195);

    
        // Notion matin / apres midi
        for (let i = 0; i < 10; i++){
            doc.fontSize(6);
            if(i%2 == 0) {
                doc.lineJoin('miter')
                    .rect(200 + (60 * i), yApprenant, 60, 30)
                    .stroke()
                    .font('Helvetica-Bold')
                    .text('MATIN', 205 + (60 * i), yApprenant + 8, {width: 60, align: 'left'})
                    .text('Durée en h : 4', 205 + (60 * i), yApprenant + 16, {width: 60, align: 'left'});
            }else {
                doc.lineJoin('miter')
                    .rect(200 + (60 * i), yApprenant, 60, 30)
                    .stroke()
                    .font('Helvetica-Bold')
                    .text('APRES-MIDI', 205 + (60 * i), yApprenant + 8, {width: 60, align: 'left'})
                    .text('Durée en h : 3', 205 + (60 * i), yApprenant + 16, {width: 60, align: 'left'});
            }
        }

        apprenants.forEach(apprenant =>{
            doc.fontSize(7);

            // Les nom prenom des apprenants
            doc.lineJoin('miter')
                .rect(xApprenant, yApprenant + 30, 170, 40)
                .stroke()
                .font('Helvetica-Bold')
                .text(`${apprenant}`, xApprenant + 8, yApprenant + 48);

            // emplacement signature
            for (let j = 0; j < 10; j++) {
                doc.lineJoin('miter')
                    .rect(xApprenant + (170 + 60 * j), yApprenant + 30, 60, 40)
                    .stroke()
            }
            yApprenant += 40;
        });

        // nom prénom formateur
        for(let k = 0; k < formateur.length; k++){
            doc.fontSize(8);
            doc.lineJoin('miter')
                .rect(xApprenant + 170 + (120 * k), yApprenant + 30, 120, 60)
                .stroke()
                .font('Helvetica-Bold')
                .text('NOM Prénom formateur.rice', xApprenant  + 170 + (120 * k), yApprenant + 38, {width: 120, align: 'center'})
                .text(`${formateur[k]}`, xApprenant + 170 + (120 * k), yApprenant + 58, {width: 120, align: 'center'});
        }

        // Emplacement cachet de l'organisme de formation
        doc.lineJoin('miter')
            .rect(xApprenant + 550, yApprenant + 110, 220, 80)
            .stroke()
            .font('Helvetica')
            .text(`Cachet organisme de formation :`, 585, yApprenant + 118);

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