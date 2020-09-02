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
        const link = req.protocol + '://' + req.get('host') + `/api/emargements/signature?apprenant=${apprenant}&jour=${jour}&creneau=${creneau}`;
        const signCreneau = await Assign.findOne({ signLink: link, userId: apprenant});

        let timeCreated = signCreneau.createdAt;
        let timeNow = new Date();
        let isEndTimer = timeNow - timeCreated;

        // 10min delay to sign (600000ms)
        if (isEndTimer <= 600000) {
            const apprenantSign  = await User.findOne({_id: apprenant});
            const identite       = `${apprenantSign.name} ${apprenantSign.surname}`;
            const emargementInfo = await Signoffsheet.findOne({ _id: signCreneau.signoffsheetId });

            // get learner index
            const indexlearner = emargementInfo.learners.indexOf(identite);

            // get day index
            const dateSearchedOld = jour.split('-');
            const dateSearched    = `${dateSearchedOld[2]}/${dateSearchedOld[1]}/${dateSearchedOld[0]}`;
            const indexDay        = emargementInfo.days.indexOf(dateSearched);
        
            // put sign at right location
            const allSignLocation  = emargementInfo.signLocation;
            const signLocatioArray = emargementInfo.signLocation[indexlearner];
            const morningArray     = [];
            const afternoonArray   = [];

            for (let y = 0; y < signLocatioArray.length; y++) {
                if(y % 2 == 0) {
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

            await newArraySaved.save();
            res.status(200).json({
                success: true,
                message: 'Document signé'
            });

        } else {
            res.status(200).json({
                success: false,
                message: 'Lien expiré'
            });
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Une erreur est survenue'
        });
    }
}