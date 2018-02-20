const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        username:String,
        password:String,
        //social login con passport
        // facebookID: String,
        // displayName: String,
        // email: String,
        // googleID: String,
        role:{
            type: String,
            enum: ["DEVELOPER", "TA", "BOSS"],
            default: "DEVELOPER"
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