const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId; 

const signoffsheetSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    templateId: {
        type: ObjectId,
        require: true, 
        ref: 'templates'
    },
    apprenants: {
        type: Array
    },
    jours: {
        type: Array
    },
    formateur: {
        type: Array
    }
}, { timestamps: true });

module.exports = mongoose.model('signoffsheet', signoffsheetSchema);