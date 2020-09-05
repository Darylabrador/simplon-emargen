const mongoose = require("mongoose");

const ObjectId = mongoose.Types.ObjectId;

const signoffsheetSchema = mongoose.Schema({
    templateId: {
        type: ObjectId,
        ref: "templates", 
        required: true
    },
    promoId: {
        type: ObjectId,
        ref: 'yeargroups',
        required: true
    },
    urlSheet: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    learners: {
        type: Array
    },
    days: {
        type: Array
    },
    trainers: {
        type: Array
    },
    timeStart: {
        type: String
    },
    timeEnd: {
        type: String
    },
    version: {
        type: Number,
        default: 1
    },
    versionningHistory: {
        type: Array,
        default: null
    },
    fileExist: {
        type: Boolean,
        default: false
    },
    signLocation: {
        type: Array
    }
}, { timestamps: true })

module.exports = mongoose.model('signoffsheets', signoffsheetSchema);