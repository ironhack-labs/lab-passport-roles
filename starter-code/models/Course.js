const mongoose = require('mongoose')
const Schema = mongoose.Schema
 const courseSchema = new Schema({
    name: {
        type: String,
        unique: true
    }
},
{
    timestamps: {
        createdAt: true,
        updatedAt: true,
    }
})
 module.exports = mongoose.model('Course', courseSchema) 