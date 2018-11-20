const mongoose = require('mongoose');
const User= require('../models/user');
const bcrypt = require('bcrypt');
mongoose.connect(`mongodb://localhost/user`)
const passwords = "123";
const saltRounds = 5
const salt = bcrypt.genSaltSync(saltRounds);
const hash = bcrypt.hashSync(passwords, salt);


const users =
    [
        {
            name: "Pepe",
            role: "Boss",
            password:hash,
        },
        {
            name: "Paco",
            role: "Developer",
            password: hash,
        },
        {
            name: "Juan",
            role: "TA",
            password: hash,
        },
    ];
User.create(users)
    .then(() => console.log('Users created on DB'))
    .then(() => mongoose.disconnect());