const mongoose = require('mongoose')
const User = require('../models/User')
const passport = require('passport')

const dbName = 'passport-roles';
mongoose.connect(`mongodb://localhost/${dbName}`);

const users = {
    username: 'Julian',
    role: 'BOSS'
}

User.register(users,'123')
    .then(user=>{
        console.log(user)
        mongoose.connection.close()
    })
    .catch(e=>console.log(e))
    