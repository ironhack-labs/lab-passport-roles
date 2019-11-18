const mongoose = require('mongoose');
const Users = require('../models/User')
const bcrypt = require('bcrypt');
const bcryptSalt = 10;




mongoose
    .connect('mongodb://localhost/rolesLab', { useNewUrlParser: true })
    .then(x => {
        console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
    })
    .catch(err => {
        console.error('Error connecting to mongo', err)
    });



const users = [
    {
        username : "Pedro",
        password : "123",
        role : "Boss"
    },
    {
        username: "Alex",
        password: "123",
        role: "TA"
    },
    {
        username: "Carmen",
        password: "123",
        role: "TA"
    },
    {
        username: "Julio",
        password: "123",
        role: "TA"
    },
    {
        username: "Ana",
        password: "123",
        role: "Developer"
    },
    {
        username: "Juan",
        password: "123",
        role: "Developer"
    },
    {
        username: "Carla",
        password: "123",
        role: "Developer"
    }
]

//   Hash password before insert in db
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
            .then(dbSeed => {
                console.log({ alert: 'Database was seed' }, dbSeed)
            })
            .catch(err => {
                console.log(err)
            })
    })