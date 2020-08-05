const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId; 

const templateSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    intitule: {
        type: String,
        require: true
    },
    organisme: {
        type: String,
        require: true
    },
    logo: {
        type: String,
        require: true
    }
}, { timestamps: true });

module.exports = mongoose.model('templates', templateSchema);