let mongoose = require('mongoose');

let BookSchema = new mongoose.Schema({

    isbn: {
        type: String,
        required: true
    },

    title: {
        type: String,
        required: true
    },


    author: {
        type: String,
        required: true
    },

    publisher: {
        type: String,
        required: true
    }


})

module.exports = mongoose.model('Book',BookSchema);