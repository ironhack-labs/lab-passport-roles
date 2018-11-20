const mongoose = require('mongoose');
const UserSchema = mongoose.Schema;

const user = new UserSchema({
    name:{type:String},
    role:{
    type:String,
    enum:['Boss', 'Developer', 'TA']
    },
    password:{type:String}
});


const User =mongoose.model('User',user);




module.exports = User;
