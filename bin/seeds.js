const mongoose = require('mongoose');
const User = require('../models/User.model')

const nameDb = 'ironhack-passport-roles'
mongoose.connect(`mongodb://localhost/${nameDb}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

User.collection.drop()

const users = [
    {
        username: 'theBoss',
        name: 'Germán',
        password: 'iamtheboss',
        profileImg: '',
        description: 'General Manager',
        facebookId: '52ad5trd1423aa',
        role: 'BOSS'
    }
]

User.create(users)
    .then(allUsers => console.log(allUsers.length, 'users created'))
    .catch(err => console.log(err))