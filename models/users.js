const mongoose = require("mongoose");

const ObjectId = mongoose.Types.ObjectId;

const userSchema = mongoose.Schema({
    promoId: {
        type: ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String, 
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: "apprenant"
    },
    firstConnection: {
        type: Boolean,
        default: true
    },
    signImage: {
        type: String,
    },
    resetToken: {
        type: String
    }
}, {timestamps: true})

module.exports = mongoose.model('users', userSchema);