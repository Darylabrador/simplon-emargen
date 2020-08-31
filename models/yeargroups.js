const mongoose = require("mongoose");

const yeargroupSchema = mongoose.Schema({
    label: {
        type: String,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('yeargroups', yeargroupSchema);