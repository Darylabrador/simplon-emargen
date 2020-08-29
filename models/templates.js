const mongoose = require("mongoose");

const ObjectId = mongoose.Types.ObjectId;

const templateSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    intitule: {
        type: String,
        required: true
    },
    organisme: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('templates', templateSchema);