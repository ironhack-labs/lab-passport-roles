const mongoose = require('mongoose')
const User = require('../models/user.model')

const dbName = 'passport-roles';

mongoose.connect(`mongodb://localhost/${dbName}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
User.collection.drop()

const bcrypt = require("bcrypt")
const bcryptSalt = 10

const psw = "44444"

const salt = bcrypt.genSaltSync(bcryptSalt)
const hashPass = bcrypt.hashSync(psw, salt)

const users = [{
    username: 'test2',
    name: 'Damian',
    password: hashPass,
    profileImg: '',
    description: '',
    facebookId: '',
    role: 'BOSS'
}]

User.create(users)
    .then(users => console.log(users))
    .catch(err => console.log(`Ha sucedido un error: ${err}`))