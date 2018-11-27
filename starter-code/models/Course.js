const mongoose = require('mongoose')
const Schema = mongoose.Schema

const courseSchema = new Schema({
  title:String,
  students:[
    {
      type:Schema.Types.ObjectId,
      ref:'User'
    }
  ]
},{
  timestamps:{
    createdAt:true,
    updatedAt:true
  }
})

module.exports = mongoose.model('Course', courseSchema)