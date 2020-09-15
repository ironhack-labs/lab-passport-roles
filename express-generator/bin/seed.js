require('dotenv').config()
const mongoose = require('mongoose')
const Users = require('../models/User.model')
const bcrypt = require('bcryptjs')

const bcryptSalt = 10

const pass = "0000"

const salt = bcrypt.genSaltSync(bcryptSalt)
const hashPass1 = bcrypt.hashSync(pass, salt)

mongoose.connect(`mongodb://localhost/${process.env.DB}`, { useNewUrlParser: true, useUnifiedTopology: true })


const users = [
    {
        name: 'Pedro',
        password: hashPass1,
        role: 'BOSS'
    },
]
mongoose.connection.collections['users'].drop(() => console.log("Collection droped")) 

Users.create(users)
    .then(allUsers => console.log('Se han creado', allUsers.length, 'user en la bbdd'))
    .catch(err => console.log("Error: ", err))