const mongoose = require('mongoose')
const Users = require('../models/User');
const bcrypt = require("bcrypt")
const bcryptSalt = 12;
const databaseIH = 'ironhack';

const salt = bcrypt.genSaltSync(bcryptSalt);
const hashPass = bcrypt.hashSync('1234', salt);

mongoose.connect(`mongodb://localhost/${databaseIH}'`, { useNewUrlParser: true })


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

Users.create(initialUser, (err) => {
    if (err) {
        throw err
    }
    console.log(`Created ${users.length} users`)
    mongoose.connection.close;
});
