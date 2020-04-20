const mongoose = require('mongoose');
const User = require('../models/User.model');
const bcrypt = require('bcrypt')
const bcryptSalt = 10

const dbName = 'passport-roles';

mongoose.connect(`mongodb://localhost/${dbName}`, { useNewUrlParser: true, useUnifiedTopology: true });

const users = [
    {
        username: "gaga",
        name: "Gabriela",
        role: "BOSS",
        password: bcrypt.hashSync('gaby', bcryptSalt)

    },
    {
        username: "lupe",
        name: "Lupita",
        role: "TA",
        password: bcrypt.hashSync('lupita', bcryptSalt)

    },
    {
        username: "harry",
        name: "Harry",
        role: "DEV",
        password: bcrypt.hashSync('harry', bcryptSalt)

    },
    {
        username: "natalia",
        name: "Natalia",
        role: "STUDENT",
        password: bcrypt.hashSync('natalia', bcryptSalt)

    },
    {
        username: "luis",
        name: "Luis",
        role: "GUEST",
        password: bcrypt.hashSync('luis', bcryptSalt)

    },

]

User.create(users)
    .then(allTheUsers => {
        console.log(`${allTheUsers.length} users created!`)
        mongoose.connection.close();
    })
    .catch(err => console.log(`An error ocurred: ${err}`))
