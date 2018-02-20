const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        userName: String,
        password:String,
        //social login
        facebookId:String,
        email:String,
        displayName:String,
        role: {
          type:String,
          enum:["Boss","Developer","TA","Student"],
          default:"Student"
        },
    },
    {
        timestamps:{
            createdAt:"created_at",
            updatedAt:"updated_at"
        }
    });

module.exports = mongoose.model("User", userSchema);