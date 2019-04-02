const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema(
  {
   name:{type: String, required:true, unique:true},
   role:{type: String, required:true, 
    enum:["GUEST","BOSS","DEVELOPER","TA"]
    ,default:"GUEST"} ,
    password: String,
    facebookId: String,
    displayName: String,
  },
  { timestamps: true }
);

userSchema.plugin(passportLocalMongoose, {
  usernameField: "name",
  hashField: "password"
});

module.exports = mongoose.model("User", userSchema);