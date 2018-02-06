const mongoose = require("mongoose");
const Schema = mongoose.Schema;



const UserSchema = Schema({
    username: String,
    name: String,
    familyName: String,
    password: String,
    role: {
        type: String,
        enum: ['Boss', 'Developer', 'TA'],
        default: 'Boss'
    },
});


const User = mongoose.model("User", UserSchema);
module.exports = User;