const mongoose = require('mongoose')
const Schema = mongoose.Schema

const courseSchema = new Schema({
    title: String,
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard', 'Tenemos que poner reggeaton para acabar']
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Course', courseSchema)