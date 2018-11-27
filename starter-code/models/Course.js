const mongoose = require('mongoose')
const Schema = mongoose.Schema

const courseSchema = new Schema({
  title:String
},{
  timestamps:{
    createdAt:true,
    updatedAt:true
  }
})

module.exports = mongoose.model('Course', courseSchema)