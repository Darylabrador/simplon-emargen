/**
 * Middleware to know if user is connected (for learners)
 */

const dotenv = require('dotenv').config();
const jwt    = require('jsonwebtoken');

module.exports = (req, res, next) => {

    // Get Authorization header from request
    const authheader = req.get('Authorization');

    // Verify if we have the Authorization header
    if(!authheader) {
        return res.status(401).json({
            success: false,
            session: true,
            message: 'Pas authentifier'
        });
    }

    // Try to decode the token using the secret, to know if it's authorized or not
    const token = authheader.split(' ')[1];
    let decodedToken;

    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
        return res.status(500).json({
            success: false,
            session: true,
            message: 'Une erreur est survenue'
        });
    }

    req.userId = decodedToken.userId;
    next();
}