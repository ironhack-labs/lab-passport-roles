const mongoose = require('mongoose')
const dbName =  'celebritydb'

mongoose.connect(`mongodb://localhost/${dbName}`)

const User = require('../models/User.model')

const users = [
    {
        name: 'BOSS',
        password: boss,
        profileImg: String,
        description: String,
        facebookId: String,
    }
]

User.create(users)

    .then(allUsers => {
        console.log(`Created ${allUsers.length} users`)
        mongoose.connection.close()
    })
    .catch(err => console.log('There was an error creating the users', err))