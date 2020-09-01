const mongoose = require("mongoose");

const ObjectId = mongoose.Types.ObjectId;

const userSchema = mongoose.Schema({
    promoId: {
        type: ObjectId,
        default: null
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
        // unique: true
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
        default: null
    },
    resetToken: {
        type: String,
        default: null
    }
}, {timestamps: true})

module.exports = mongoose.model('users', userSchema);