const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//passport pero mejor y mas rapido., 
    //hay que descargar la libreria passport-local-mongoose y passport
const plm = require("passport-local-mongoose")

const userSchema = new Schema ({
    username:String,
    password:String,
    roles:{
        type:String,
        enum:["BOSS","DEVELOPER","TA"],
        default:"DEVELOPER"
    },
},{
    timestamps:{
        createdAt:"created_at",
        updatedAt: "updated_at"
    }
    
});

userSchema.plugin(plm,{usernameField:"username"});
const User= mongoose.model("User",userSchema)
module.exports = User;