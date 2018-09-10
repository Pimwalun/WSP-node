let mongoose = require('mongoose');

let trophySchema = mongoose.Schema({
    trophy: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

let Trophy = module.exports = mongoose.model('Trophy', trophySchema);