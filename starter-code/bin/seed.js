const mongoose = require('mongoose');
const User = require('../models/user');
const dbtitle = 'passport-roles';
mongoose.connect(`mongodb://localhost/${dbtitle}`);

User.collection.drop();

const password = "P@ssw0rd";

const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const salt = bcrypt.genSaltSync(bcryptSalt);
const password = "ironhack";
const encryptedPass = bcrypt.hashSync(password, salt);


const users = [
    {
        name: "Jean Boss",
        password: encryptedPass,
        email: "jb@bosscompany.com",
        role: "BOSS"
    },
    {
        name: "Mathilde Tasoeur",
        password: encryptedPass,
        email: "mt@bosscompany.com",
        role: "TA"
    },
    {
        name: "Kevin Du Cran",
        password: encryptedPass,
        email: "kdc@bosscompany.com",
        role: "DEV"
    },
];


User.insertMany(users)
    .then(users => {
        users.forEach(user => {
            console.log(`${user.role} added!`)
        })
        mongoose.connection.close();
    })
    .catch(error => {
        console.log(error)
    })