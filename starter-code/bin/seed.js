const mongoose = require('mongoose');
const User = require('../models/user.models')
const bcrypt = require('bcrypt')
const bcryptSalt = 10;

const dbName = 'Iron-Hack';
mongoose.connect(`mongodb://localhost/${dbName}`);

const user = {
    username: "Tom Holland",
    password: "Actor",
    role: "Boss"
}

const salt = bcrypt.genSaltSync(bcryptSalt)
const hashPass = bcrypt.hashSync(user.password, salt)

User.create({
        username: user.username,
        password: hashPass,
        role: user.role,
    })
    .then(newUser => console.log(`Created a boss`))
    .then(() => mongoose.connection.close())
    .catch(err => console.log("Error consultando la BBDD", err))