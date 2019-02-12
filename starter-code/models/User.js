let mongoose = require('mongoose')
let Schema = mongoose.Schema
let PLM = require('passport-local-mongoose')

let userSchema = new Schema({
  name:String,
  email:String,
  picture:String,
  role: {
    type:String,
    enum:['BOSS',"ALUMN", "TA"],
    default:"ALUMN"
  },
},{timestamps:true,
versionKey:false})

userSchema.plugin(PLM,{usernameField:"email"})

module.exports = mongoose.model('User',userSchema)