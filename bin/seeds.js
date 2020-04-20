const mongoose = require('mongoose');
const User = require('../models/User.model');

const bcrypt = require("bcrypt")
const bcryptSalt = 10
const salt = bcrypt.genSaltSync(bcryptSalt)


const dbName = 'passport-roles';
mongoose.connect(`mongodb://localhost/${dbName}`);

const users = [
    {
        username: "user1",
        name: "user 1",
        password: bcrypt.hashSync('user1', salt),
        profileImg: " ",
        description: " ",
        facebookId: 'user_1',
        role: 'BOSS'
    },
    {
        username: "user2",
        name: "user 2",
        password: bcrypt.hashSync('user2', salt),
        profileImg: " ",
        description: " ",
        facebookId: 'user_2',
        role: 'DEV'
    },
    {
        username: "user3",
        name: "user 3",
        password: bcrypt.hashSync('user3', salt),
        profileImg: " ",
        description: " ",
        facebookId: 'user_3',
        role: 'TA'
    },
    {
        username: "user4",
        name: "user 4",
        password: bcrypt.hashSync('user4', salt),
        profileImg: " ",
        description: " ",
        facebookId: 'user_4',
        role: 'STUDENT'
    }, {
        username: "user5",
        name: "user 5",
        password: bcrypt.hashSync('user5', salt),
        profileImg: " ",
        description: " ",
        facebookId: 'user_5',
        role: 'GUEST'
    }
];

User.create(users, (err) => {
    if (err) { throw (err) }
    console.log(`Created ${users.length} users`)
    mongoose.connection.close();
});