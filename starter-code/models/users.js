const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/ibi-ironhack',  {useMongoClient: true});
mongoose.Promise = require('bluebird');

const userSchema = new Schema({
    username: {type: String},
    password: {type: String},
    firstName: {type: String},
    lastName: {type: String},
    role: {
        type: String,
        enum: ['Boss', 'Developer', 'TA', 'Alumni' ],
        default: ['Alumni']
    }   
});

const User = mongoose.model('user', userSchema);
module.exports = User;