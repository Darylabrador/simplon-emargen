const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId; 

const templateSchema = mongoose.Schema({
    templateId: {
        type: ObjectId,
        require: true
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

module.exports = mongoose.model('template', templateSchema);