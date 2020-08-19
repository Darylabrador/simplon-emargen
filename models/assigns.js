const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const assignSchema = mongoose.Schema({
    users: [{
        type: ObjectId,
        ref: 'users'
    }],
    signoffsheet: {
        type: ObjectId,
        ref: 'signoffsheets'
    }
});

module.exports = mongoose.model('assigns', assignSchema);