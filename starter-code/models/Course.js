const passportLocalMongoose = require('passport-local-mongoose')
const Schema = require('mongoose').Schema

const courseSchema = new Schema({
  title:String,
  content:String,
  userId:{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
},
{
  timestamps:true
})

module.exports = require('mongoose').model('Course', courseSchema)