const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new require('mongoose').Schema({
    name: String
});


module.exports = mongoose.model('Course', courseSchema);