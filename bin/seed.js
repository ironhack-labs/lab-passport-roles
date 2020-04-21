const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const User = require('../models/User.model');


mongoose.connect('mongodb://localhost/passportRoles', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

bcrypt.hash('123', 10, function(err, hash) {
    // Store hash in your password DB.
    const users = [
        {
            username: 'boss',
            name: 'Pedro',
            password: hash,
            profileImg: '../images/blackpanzer.jpg',
            description: 'Primer registro del seed',
            facebookId: 'algo',
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

