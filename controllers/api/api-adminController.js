const fs          = require('fs');
const path        = require('path');

const PDFDocument = require('pdfkit');

const pdfFunction   = require('../../utils/pdfGenerator');
const Template      = require('../../models/templates');
const Signoffsheet  = require('../../models/signoffsheets');
const User          = require('../../models/users');
const Yeargroup     = require('../../models/yeargroups');
const Assign        = require('../../models/assigns');

exports.signEmargement = async (req, res, next) => {
    const apprenant = req.query.apprenant;
    const jour      = req.query.jour;
    const creneau  = req.query.creneau;

    try {
        // const link = req.protocol + '://' + req.get('host') + `/api/emargements/signature?apprenant=${apprenant}&jour=${jour}&creneau=${creneau}`;
        const link = req.protocol + '://' + '192.168.1.15:3000' + `/api/emargements/signature?apprenant=${apprenant}&jour=${jour}&creneau=${creneau}`;
        const signCreneau = await Assign.findOne({ signLink: link, userId: apprenant});

        let timeCreated = signCreneau.createdAt;
        let timeNow = new Date();
        let isEndTimer = timeNow - timeCreated;

        // 10min delay to sign (600000ms)
        if (isEndTimer <= 600000) {
            if (!signCreneau.alreadySign) {
                const apprenantSign = await User.findOne({ _id: apprenant });
                const identite = `${apprenantSign.name} ${apprenantSign.surname}`;
                const emargementInfo = await Signoffsheet.findOne({ _id: signCreneau.signoffsheetId });

                // get learner index
                const indexlearner = emargementInfo.learners.indexOf(identite);

                // get day index
                const dateSearchedOld = jour.split('-');
                const dateSearched = `${dateSearchedOld[2]}/${dateSearchedOld[1]}/${dateSearchedOld[0]}`;
                const indexDay = emargementInfo.days.indexOf(dateSearched);

                // put sign at right location
                const allSignLocation = emargementInfo.signLocation;
                const signLocatioArray = emargementInfo.signLocation[indexlearner];
                const morningArray = [];
                const afternoonArray = [];

                for (let y = 0; y < signLocatioArray.length; y++) {
                    if (y % 2 == 0) {
                        morningArray.push(signLocatioArray[y]);
                    } else {
                        afternoonArray.push(signLocatioArray[y]);
                    }
                }

                if (creneau == "morning") {
                    morningArray[indexDay][4] = apprenantSign.signImage;
                }

                if (creneau == "afternoon") {
                    afternoonArray[indexDay][4] = apprenantSign.signImage;
                }

                // save modification to database
                emargementInfo.signLocation = [];
                const newArraySaved = await emargementInfo.save();

                allSignLocation.forEach(element => {
                    newArraySaved.signLocation.push(element)
                })

                newArraySaved.signLocation[indexlearner] = [];

                for (let y = 0; y < signLocatioArray.length; y++) {
                    if (y % 2 == 0) {
                        newArraySaved.signLocation[indexlearner].push(signLocatioArray[y])
                    } else {
                        newArraySaved.signLocation[indexlearner].push(signLocatioArray[y])
                    }
                }

                // regenerate PDF
                signCreneau.alreadySign = true;
                await signCreneau.save();

                const regenerateData = await newArraySaved.save();
                const regenerate = await regenerateData.populate().populate('templateId').execPopulate();

                const logoTemplate = path.join('public', regenerate.templateId.logo);
                const signoffPath  = path.join('data', 'pdf', regenerate.name);

                const doc = new PDFDocument({
                    size: 'A4',
                    layout: 'landscape',
                    autoFirstPage: false
                });

                doc.pipe(fs.createWriteStream(signoffPath).on('close', () => {
                    res.status(200).json({
                        success: true,
                        message: 'Document signé'
                    });
                    doc.pipe(res);
                }));

                let xEntete = 200;
                let yEntete = 160;
                let xApprenant = 30;
                let yApprenant = 182;
                var compteurInitPlage = 0;
                var compteurFinPlage = 5;

                for (let y = 0; y < regenerate.learners.length; y++) {
                    if (y % 5 == 0) {
                        doc.addPage();
                        pdfFunction.headerPdf(doc, logoTemplate, regenerate.templateId.intitule, regenerate.templateId.organisme);
                        pdfFunction.corpsPdfSignature(doc, xEntete, yEntete, xApprenant, yApprenant, regenerate.days, regenerate.learners, regenerate.trainers, compteurInitPlage, compteurFinPlage, regenerate.signLocation);
                        compteurInitPlage += 5;
                        compteurFinPlage += 5;
                    }
                }
                doc.end();
            } else {
                res.status(422).json({
                    success: false,
                    message: 'Document déjà signé'
                });
            }
        } else {
            res.status(422).json({
                success: false,
                message: 'Lien expiré'
            });
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Une erreur est survenue'
        });
    }
}

exports.postSignature = async (req, res, next) =>{
    const { signature } = req.body;
    const signType = signature.split(';')[0];

    try {
         // Construct image from base64 data image
        if (signType == 'data:image/png') {

            // Data information about image
            const dataSignImage  = signature.replace(/^data:image\/\w+;base64,/, "");
            const userUpdateSign = await User.findOne({_id: req.userId});

            if (userUpdateSign.signImage == null) {
                userUpdateSign.signImage = dataSignImage;
                const savedUpdatedUser = await userUpdateSign.save();

                res.status(200).json({
                    success: true,
                    notConfigSign: savedUpdatedUser.signImage != null,
                    message: 'Signature configurée'
                });
            } else {
                res.status(422).json({
                    success: false,
                    message: 'Signature déjà configurée'
                });
            }
        } else {
            res.status(422).json({
                success: false,
                message: 'Signature invalide'
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Une erreur est survenue'
        });
    }
}