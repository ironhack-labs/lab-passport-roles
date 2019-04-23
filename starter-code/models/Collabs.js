const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const collabSchema = new mongoose.Schema ( {
    email: String,
    rol: {
        type: String,
        enum: ["DEVELOPER", "TA"]
    }
}, {
    timestamps: true,
    versionKey: false,
})

collabSchem.plugin(passportLocalMongoose), {usernameField: 'email'})

module.exports = mongoose.model('collabs', collabSchema)