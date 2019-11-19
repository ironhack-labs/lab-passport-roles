const mongoose = require('mongoose');
const Users = require('../models/User')
const bcrypt = require('bcrypt');
const bcryptSalt = 12;


mongoose
    .connect('mongodb://localhost/ironhack', { useNewUrlParser: true })
    .then(x => {
        console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
    })
    .catch(err => {
        console.error('Error connecting to mongo', err)
    });

const users = [
    {
        username: "Carlos",
        password: "1234",
        role: "BOSS"
    },
    {
        username: "Sonia",
        password: "1234",
        role: "DEVELOPER"
    },
    {
        username: "Valeria",
        password: "1234",
        role: "TA"
    }
]

users.map(user => {
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(user.password, salt);

    user.password = hashPass;
})

Users
    .deleteMany()
    .then(() => {
        Users
            .insertMany(users)
            .then(databaseIH => {
                console.log({ alert: 'Database ok' }, databaseIH)
            })
            .catch(err => {
                console.log(err)
            })
    })