const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const User = require('../models/user');

const DB_NAME = 'starter-code';

mongoose.connect('mongodb://localhost/starter-code', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

bcrypt.hash('123', 10, function(err, hash) {
    // Store hash in your password DB.
    const users = [
        {
            username: 'boss',
            password: hash,
            role: 'BOSS'
        }
    ]
    User.create(users, err => {
        if(err) {
            throw err;
            return
        }
        console.log(`Created user: ${users[0].username}`);
        mongoose.connection.close();
    })
});

//Thinking around, just keep it here...
// bcrypt.hash('password', 10)
//         .then( hashPass => {
//         return User.create({
//             username: 'Boss',
//             password: hashPass,
//             role: 'BOSS'
//         })

// bcrypt.hash(password, 10)
//     .then(hash => {
//       return User.create({
//         username: 'Boss',
//         password: hash,
//         role: 'Boss'
//       })
//       .then(user => {
//         console.log(`Created user: ${user.username}`);
//         mongoose.connection.close();
//       })
//     .catch(e => {
//         console.log(e)
//     })
//     })
