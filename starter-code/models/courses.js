const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/ibi-ironhack',  {useMongoClient: true});
mongoose.Promise = require('bluebird');

const courseSchema = new Schema({
    name: {type: String},
    start_date: {type: Date},
    end_date: {type: Date},
    level: {type: String},
    available: {type: Boolean },
    alumni: {type: Array}
});

const Course = mongoose.model('course', courseSchema);
module.exports = Course;