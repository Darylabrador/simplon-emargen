const { validationResult } = require('express-validator');
const bcrypt               = require('bcryptjs');
const jwt                  = require('jsonwebtoken');
const dotenv               = require('dotenv').config();

const User = require('../../models/users');

exports.postLogin = async (req, res, next) => {
    const { email, password } = req.body;
    const errors = validationResult(req);

    try {
        if(!errors.isEmpty()) {
            return res.status(422).json({
                success: false,
                message: errors.array()[0].msg
            });
        };

        const userExist = await User.findOne({ email: email, role: 'apprenant' });
        if(!userExist){
            return res.status(422).json({
                success: false,
                message: 'Identifiants invalides'
            });
        };

        const isEqual = await bcrypt.compare(password, userExist.password);
        if(!isEqual) {
            return res.status(422).json({
                success: false,
                message: 'Identifiants invalides'
            });
        };

        const token = jwt.sign({
                identite: `${userExist.name} ${userExist.surname}`,
                email: userExist.email,
                userId: userExist._id.toString()
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.status(200).json({
            sucess: true,
            token: token,
            identite: `${userExist.name} ${userExist.surname}`,
            firstConnection: userExist.firstConnection,
            signImage: userExist.signImage,
            message: 'Vous êtes connecté(e)'
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Une erreur est survenue'
        });
    }
};

exports.postReinitPass = async (req, res, next) => {
    const { oldpass, newpass } = req.body;
    const errors = validationResult(req);

    try {
        if (!errors.isEmpty()) {
            return res.status(422).json({
                success: false,
                message: errors.array()[0].msg
            });
        };
        
        const userUpdated = await User.findOne({ _id: req.userId });
        const isEqual = await bcrypt.compare(oldpass, userUpdated.password);
        if(!isEqual){
            return res.status(422).json({
                success: false,
                message: 'Ancien mot de passe invalide'
            });
        }

        const newHashedPwd          = await bcrypt.hash(newpass, 12);
        userUpdated.password        = newHashedPwd;
        userUpdated.firstConnection = false;
        const userAfter = await userUpdated.save();

        res.status(200).json({
            sucess: true,
            firstConnection: userAfter.firstConnection,
            signImage: userAfter.signImage,
            message: 'Mise à jour effectuée'
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Une erreur est survenue'
        });
    }
}