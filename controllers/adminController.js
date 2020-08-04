const fs          = require('fs');
const path        = require('path');

const PDFDocument = require('pdfkit');

const { validationResult } = require('express-validator');
const axios                = require('axios');


/** get admin dashboard
 * @name getDashboard
 * @function
 * @param {string} voteId
 * @param {string} userId
 * @throws Will throw an error if one error occursed
 */
exports.getDashboard = async (req, res) => {
    try {
        res.render('index', {
            title: 'Dashboard',
            path: '/dashboard',
            errorMessage: null,
            page: ""
        })
    } catch (error) {
        const err = new Error(error);
        err.httpStatusCode = 500;
        return next(err);
    }
};

/** handle post generated pdf
 * @name postSignOffShettPdf
 * @function
 * @param {string} voteId
 * @param {string} userId
 * @throws Will throw an error if one error occursed
 */
exports.postSignOffShettPdf = async (req, res) => {
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

    const { createdBy, intitule, dataSheetUrl } = req.body;
    const imageFile = req.file;

    if (!imageFile) {
        return res.json({
            success: false,
            message: 'Veuillez ajouter un logo'
        });
    }

    const imageUploaded = imageFile.path.replace("\\", "/"); // uniquement sous windows
    const image = imageFile.path.split('public')[1];

    const infoUrl = dataSheetUrl.split('/')[5];

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


        const signoffPDF = 'emargement-' + new Date().getTime() + '.pdf';
        const signoffPath = path.join('data', 'pdf', signoffPDF);

        const doc = new PDFDocument({
            size: 'legal',
            layout: 'landscape'
        });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="' + signoffPDF + '"');

        doc.pipe(fs.createWriteStream(signoffPath));
        doc.pipe(res);

        doc.image(imageUploaded, 80, 50, {width: 150});
        doc.fontSize(16);
        doc
            .font('Helvetica-Bold')
            .text('FEUILLE D\'EMARGEMENT -> PERIODE DE FORMATION', 250, 65);

        doc.fontSize(9)

        doc
            .font('Helvetica-Bold')
            .text(`Intitulé : ${intitule}`);

        doc
            .font('Helvetica-Bold')
            .text(`Organisme de formation : `);

        doc
            .font('Helvetica')
            .text('SIMPLON REUNION', 400, 95);
    
 

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