
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
         username:String,
        name:String,
        familyName:String,
        password:String,
        role:{
            type: String,
            enum: ["Boss", "Dev", "TA"],
            default: "Dev"
        }
    }
 
    );

module.exports = mongoose.model("User", userSchema);

