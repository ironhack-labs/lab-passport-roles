const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose'); 

const userSchema = new Schema({
  username: String,
  email: String,
  hash: String, 
  role: {
    type: String,
    enum:["BOSS", "DEVELOPER", "TA"], 
    default: "TA"
  }
});

//Darle la posibilidad a passport-local-mongoose y usar sus modelos
userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", userSchema); //Recordar que User es la colleccion
