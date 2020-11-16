const mongoose = require('mongoose');
const User = require('../models/User.model');

const dbName = 'passport_roles';
mongoose.connect(`mongodb://localhost/${dbName}`);

const users = [
    {
        username: 'theBoss',
        name: undefined,
        password: '123456',
        profileImg: undefined,
        description: undefined,
        facebookId: undefined,
        role: 'BOSS'
    }
]

User.create(users, (err) => {
    if (err) {
        throw (err)
    }
    mongoose.connection.close();
});