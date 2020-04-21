const mongoose = require('mongoose');
const User     = require('../models/User.model')
const dbName = "passport-roles";
mongoose.connect(`mongodb://localhost/${dbName}`, { useNewUrlParser: true, useUnifiedTopology: true });
const bcrypt = require('bcrypt')

const bcryptSalt = 10

const users = [
    {
        name: 'Pepito Perez',
        password: bcrypt.hashSync('1234', bcryptSalt),
        role: 'BOSS',
        username: 'pepe'
    },
    {
        name: 'Daniel Hernandez',
        password: bcrypt.hashSync('1234', bcryptSalt),
        role: 'TA',
        username: 'dani'
    },
    {
        name: 'Julian Quiceno',
        password: bcrypt.hashSync('1234', bcryptSalt),
        role: 'STUDENT',
        username: 'juli'
    },
    {
        name: 'Camila Rojas',
        password: bcrypt.hashSync('1234', bcryptSalt),
        role: 'GUEST',
        username: 'cami'
    },
    {
        name: 'Nelly Gil',
        password: bcrypt.hashSync('1234', bcryptSalt),
        role: 'GUEST',
        username: 'Nelly'
    },
    {
        name: 'David Aguilar',
        password: bcrypt.hashSync('1234', bcryptSalt),
        role: 'STUDENT',
        username: 'Dav'
    },
    
]

User.create(users)
    .then(allMovies => {
        console.log(`${allMovies.length} movies created!`)
        mongoose.connection.close()
    })
    .catch(err => console.log(`Ups, something wrong happenedL ${err}`))
