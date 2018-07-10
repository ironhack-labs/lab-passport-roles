const passportLocalMongoose = require("passport-local-mongoose")
const mongoose = require ("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema ({
    username:String,
    role:{
        type:String, 
        enum: ["BOSS","DEVELOPER","TA","ALUMNI"],
        default: "ALUMNI"
    }
},{
    timestamps:{
        createdAt:"created_at",
        updatedAt:"updated_at",
    }
})

userSchema.plugin(passportLocalMongoose, {usernameField:"username"})
module.exports= mongoose.model("User", userSchema);