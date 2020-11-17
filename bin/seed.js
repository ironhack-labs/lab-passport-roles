const mongoose = require('mongoose')
const User = require('../models/User.model')

const bcrypt = require("bcrypt")
const bcryptSalt = 10

const salt = bcrypt.genSaltSync(bcryptSalt)
const password = "password"
const hashPass = bcrypt.hashSync(password, salt)

const dbName = 'bureau-investigation'
mongoose.connect(`mongodb://localhost/${dbName}`)

const users = [
    {
        username: "Boss",
        name: "Mr Boss",
        password: hashPass,
        profileImg: "../images/boss.jpg",
        description: "No man goes before his time - unless the boss leaves early.",
        facebookId: "",
        role: "BOSS"
    }
]

User
    .create(users)
    .then(allUsersCreated => {
        console.log(`Created ${allUsersCreated.length} users`)
        mongoose.connection.close();
    })
    .catch(err => console.log('There was an error,', err))