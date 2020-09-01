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

        const userExist = User.findOne({ email, role: 'apprenant' });
        if(!userExist){
            return res.status(422).json({
                success: false,
                message: 'Identifiants invalides'
            });
        };

        const isEqual = bcrypt.compare(password, userExist.password);
        if(!isEqual) {
            return res.status(422).json({
                success: false,
                message: 'Identifiants invalides'
            });
        };

        const token = jwt.sign({
                email: userExist.email,
                userId: userExist._id.toString()
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.status(200).json({
            sucess: true,
            token: token,
            message: 'Vous êtes connecté(e)'
        });

    } catch (error) {
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

        const newHashedPwd   = await bcrypt.hash(newpass, 12);
        userUpdated.password = newHashedPwd;
        await userUpdated.save();

        res.status(200).json({
            sucess: true,
            message: 'Mise à jour effectuée'
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Une erreur est survenue'
        });
    }
}