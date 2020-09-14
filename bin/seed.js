const mongoose = require('mongoose')
const User = require('../models/user.model')


// Hash password
const bcrypt = require('bcrypt')
const bcryptSalt = 10
const salt = bcrypt.genSaltSync(bcryptSalt)
const password = '1234'
const hashPass = bcrypt.hashSync(password, salt)


// Define DB
const dbName = 'lab-passport-roles'

// Connect to DB
//mongoose.connect(`mongodb://localhost/${dbName}`, { useNewUrlParser: true, useUnifiedTopology: true })

const users = [{
    username: 'boss',
    name: 'God',
    password: hashPass,
    description: 'I am God, I can do everything',
    facebookId: '001',
    role: 'BOSS'
}]

User.create(users)
    .then(() => console.log('Se ha creado el usuario'))
    .catch(err => console.log('Ha ocurrido un error creando el usuario'))
