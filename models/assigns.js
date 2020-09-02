const mongoose = require("mongoose");

const ObjectId = mongoose.Types.ObjectId;

const assignSchema = mongoose.Schema({
    userId: {
        type: ObjectId,
        ref: 'users'
    },
    signoffsheetId: {
        type: ObjectId,
        ref: 'signoffsheets'
    },
    signLink: {
        type: String,
        required: true
    },
    alreadySign: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

module.exports = mongoose.model('assigns', assignSchema);