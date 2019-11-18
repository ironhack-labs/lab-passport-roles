const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema ({
    username : {
        type: String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required: true
    },
    role : {
        type: String,
        enum : [
            "Boss",
            "Developer",
            "TA"
        ],
        default : "TA"
    }
})

const userModel = mongoose.model("users", userSchema);
module.exports = userModel