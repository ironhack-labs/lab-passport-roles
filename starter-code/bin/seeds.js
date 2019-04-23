require('dotenv').config(); 

const mongoose = require('mongoose')
const passport = require('../handlers/passport')
const User = require('../models/User')

mongoose.connect(process.env.DB)

const boss = {
    email: 'elmeromero@ironhack.com',
    rol: 'BOSS'
}

User.register(boss, 'elmeromero')
    .then(user => {
        console.log('El mero mero creado')
        mongoose.connection.close()
    })
    .catch(err => console.log(err))