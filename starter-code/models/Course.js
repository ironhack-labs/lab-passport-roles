const {model, Schema} = require('mongoose')

const courseSchema = new Schema ({
    name: String,
    teacher: String,
    duration: Number,
    classroom: Number
},
{
    timestamps: true
})

module.exports = model('Course', courseSchema)