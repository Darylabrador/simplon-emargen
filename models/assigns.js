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
    }
}, { timestamps: true })

module.exports = mongoose.model('assigns', assignSchema);