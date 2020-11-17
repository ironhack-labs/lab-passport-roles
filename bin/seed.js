const mongoose = require('mongoose')
const User = require('../models/user.model')

const bcrypt = require("bcryptjs")
const bcryptSalt = 10

const salt = bcrypt.genSaltSync(bcryptSalt)
const password = "password"
const hashPass = bcrypt.hashSync(password, salt)

const dbName = 'lab-passport-roles'
mongoose.connect(`mongodb://localhost/${dbName}`)


const users = [
    {
    username: 'Vogueboss',
    name: 'Anna Wintour',
    password: hashPass,
    profileImg: 'https://www.google.com/search?q=anna+wintour&sxsrf=ALeKk00sCtQM33_S161f6d08xE_7f8Ys1w:1605545168709&source=lnms&tbm=isch&sa=X&ved=2ahUKEwiUmc7rwYftAhVMA2MBHTduDDgQ_AUoAXoECA4QAw&biw=1294&bih=637#imgrc=TnGdraZNomHW8M',
    description: 'Dame Anna Wintour is a British-American journalist and editor who has been editor-in-chief of Vogue since 1988 and artistic director for Condé Nast, Vogues publisher, since 2013',
    facebookId: '',
    role: 'BOSS'  
  }
]

User
    .create(users)
    .then(allUsersCreated => {
        console.log(`Created ${allUsersCreated.length} users`)
        mongoose.connection.close()
    })
    .catch(err => console.log('Hubo un error,', err))

