const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new Schema({
    username:String,
    email:{
        type:String,
        unique:true,
        required:true
    },
    role:{
        type:String,
        enum: ['BOSS', 'DEVELOPER', 'TA', 'ALUMNI']
    }, 
    courses:{
        type: Schema.Types.ObjectId,
        ref: 'Course'
    }
},{
    timestamps:true
})

userSchema.plugin(passportLocalMongoose, {usernameField:'email'})

module.exports= mongoose.model('User', userSchema)
