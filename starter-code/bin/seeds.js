const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

mongoose
    .connect('mongodb://localhost/starter-code', { useNewUrlParser: true })
    .then(x => {
        console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
    })
    .catch(err => {
        console.error('Error connecting to mongo', err)
    });

let password = ['boss', 'developer', 'ta'];

let hashPasswords = [];


for (var i = 0; i < 3; i++) {
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password[i], salt);
    hashPasswords.push(hashPass);
}


const users = [
    {
        username: "boss",
        password: hashPasswords[0],
        role: "Boss"

    },
    {
        username: "developer",
        password: hashPasswords[1],
        role: "Developer"

    },
    {
        username: "ta",
        password: hashPasswords[2],
        role: "TA"

    }
];



User.create(users, (err) => {

    if (err) { throw (err) }
    console.log(`Created ${users.length} users`)
    mongoose.connection.close()
});
