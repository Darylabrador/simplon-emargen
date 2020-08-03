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

        console.log(apprenants);
        console.log(joursFormation);
        console.log(formateur);
        console.log(image);

    } catch (error) {
        res.json({
            success: false,
            message: "Une erreur est survenue lors de la génération du PDF !"
        });
        return error;
    }
};