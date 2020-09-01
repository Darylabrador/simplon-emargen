/**
 * Middleware to know if user is connected (for learners)
 */

const dotenv = require('dotenv').config();
const jwt    = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authheader = req.get('Authorization');

    if(!authheader) {
        return res.status(401).json({
            success: false,
            message: 'Pas authentifier'
        });
    }

    const token = authheader.split(' ')[1];
    let decodedTokn;

    try {
        decodedTokn = jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Une erreur est survenue'
        });
    }

    req.userId = decodedToken.userId;
    next();
}