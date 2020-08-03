const { validationResult } = require('express-validator');

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
            errorMessage: null
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
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.json({
            success: false,
            message: errors.array()[0].msg
        });
    }

    try {

    } catch (error) {
        res.json({
            success: false,
            message: "Une erreur est survenue lors de la génération du PDF !"
        });
        return error;
    }
};