const mongoose = require("mongoose");

const ObjectId = mongoose.Types.ObjectId;

let currentDate = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });

const assignSchema = mongoose.Schema({
    users: [{
        type: ObjectId,
        ref: 'users'
    }],
    signoffsheetId: {
        type: ObjectId,
        ref: 'signoffsheets'
    },
    assignAt: {
        type: Date,
        default: currentDate
    }
})

module.exports = mongoose.model('assigns', assignSchema);