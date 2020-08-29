const mongoose = require("mongoose");

const ObjectId = mongoose.Types.ObjectId;

const yeargroupSchema = mongoose.Schema({
    label: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('yeargroups', yeargroupSchema);