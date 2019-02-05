const mongoose = require('mongoose');

const User = require('../models/user');

const dbName = 'roles';
mongoose.connect(`mongodb://localhost/${dbName}`);

const bcrypt = require('bcrypt');
const bcryptSalt = 10;

const users = [
    {
        username: "Hugo",
        password: "llave",
        role: "Boss"
    },
    {
        username: "Nico",
        password: "candado",
        role: "Developer"
    },
    {
        username: "Antonio",
        password: "cerrojo",
        role: "TA"
    },
];

const salt = bcrypt.genSaltSync(bcryptSalt);

users.forEach(function (user) {
 user.password = bcrypt.hashSync(user.password, salt);
});

User.create(users, (err) => {
    if (err) {throw(err)};
    console.log(`created ${users.length} users`);
    mongoose.connection.close();
});