const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId; 

const signoffsheetSchema = mongoose.Schema({
    urlSheet: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    templateId: {
        type: ObjectId,
        require: true, 
        ref: 'templates'
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
}, { timestamps: true });

module.exports = mongoose.model('signoffsheets', signoffsheetSchema);