
const mongoose = require('mongoose');
    const User = require('../models/user');


const passport = require("passport");
    const bcrypt = require("bcrypt");
    const bcryptSalt = 10;

const pw = "password";
const salt = bcrypt.genSaltSync(bcryptSalt);
const hashPass = bcrypt.hashSync(pw, salt);

const dbName = 'app_name';
mongoose.connect(`mongodb://localhost/${dbName}`);

const newUser = new User({username: "BigBoss", password:hashPass, role: "BOSS"});
newUser.save()
    .then(user => {
        console.log(`New User: ${newUser} entered the system`)
        mongoose.connection.close()
    })
    .catch(err => {
        console.log(`Welcome to the dark Side!`)
        mongoose.connection.close()
    });
