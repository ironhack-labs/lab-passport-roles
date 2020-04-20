const mongoose = require('mongoose')
// const Celebrity = require('../models/celebrity')
const User = require('../models/User.model')
const dbName = 'passport-roles'
mongoose.connect(`mongodb://localhost/${dbName}`, { useNewUrlParser: true, useUnifiedTopology: true })

const bcrypt = require('bcrypt')
const bcryptSalt = 10
const salt = bcrypt.genSaltSync(bcryptSalt)


const users = [
    {
        username: 'german',
        name: 'Germán',
        password: bcrypt.hashSync('german', salt),
        profileImg: '',
        description: '',
        facebookId: '',
        role: 'BOSS'
    },
    {
        username: 'jose',
        name: 'Jose',
        password: bcrypt.hashSync('jose', salt),
        profileImg: '',
        description: '',
        facebookId: '',
        role: 'DEV'
    },
    {
        username: 'victor',
        name: 'Victor',
        password: bcrypt.hashSync('victor', salt),
        profileImg: '',
        description: '',
        facebookId: '',
        role: 'DEV'
    },
    {
        username: 'fran',
        name: 'Fran',
        password: bcrypt.hashSync('fran', salt),
        profileImg: '',
        description: '',
        facebookId: '',
        role: 'TA'
    },
    {
        username: 'enrique',
        name: 'Enrique',
        password: bcrypt.hashSync('enrique', salt),
        profileImg: '',
        description: '',
        facebookId: '',
        role: 'TA'
    }
]

User.create(users)
    .then(allUsers => {
        console.log(`${allUsers} created`)
        mongoose.connection.close()
    })
    .catch(err => console.log(`An error ocurred: ${err}`)) 