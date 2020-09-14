const mongoose = require('mongoose')
const User = require('../models/user.model')

const dbName = 'webmad0820'
mongoose.connect(`mongodb://localhost/${dbName}`, { useNewUrlParser: true, useUnifiedTopology: true })



const users = [
    {
    username: 'boss',
    name:'ana',
    password: 'hash1',
    profileImg: 'undefined',
    description: 'undefined',
    facebookId: 'undefined',
    role: 'BOSS'
        
    }
 
]

User.create(users)
    .then(allUsersCreated => console.log('Se han creado', allUsersCreated.length, 'usuarios en la BBDD'))
    .catch(err => console.log('ERROR:', err))