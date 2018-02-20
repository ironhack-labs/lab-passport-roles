const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        username:String,
        password:String,
        facebookID: String,
        displayName: String,
        email: String,
        role:{
            type: String,
            enum: ["Boss", "General Manager", "Developer", "TA", "Student"],
            default: ""
        }

    },
    {
        timestamps:{
            createdAt:"created_at",
            updatedAt:"updated_at"
        }
    }
    );

module.exports = mongoose.model("User", userSchema);