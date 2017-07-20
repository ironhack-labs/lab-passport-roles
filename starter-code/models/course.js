const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    startingDate: new Date(String),
    endDate: new Date(String),
    level: String,
    available: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;