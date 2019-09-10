const { Schema, model } = require('mongoose')

const newSchema = new Schema({
  title: String,
  desc: String,
  author: {
    ref: 'User',
    type: Schema.Types.ObjectId
  }
})

module.exports = model('Course', newSchema)