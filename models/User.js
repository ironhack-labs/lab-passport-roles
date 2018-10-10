const mongoose = require ('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require ('passport-local-mongoose');


const userSchema = new Schema ({
    username: String,
    email: String,
    password: String,
    role: {
        type: String,
        enum: ['BOSS','DEVELOPER', 'TA'],
        default: 'DEVELOPER'
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);