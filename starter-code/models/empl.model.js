const mongoose = require("mongoose")
const Schema = mongoose.Schema

const emplSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: String,
    role: {
        type: String,
        enum: ['BOSS', 'TA', 'DEV'],
    }
}, {
    timestamps: true
})

const Empl = mongoose.model("Empl", emplSchema)

module.exports = Empl