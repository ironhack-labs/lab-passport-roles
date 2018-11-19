const mongoose = require('mongoose');
const User = require('../models/User');
const Course = require('../models/Course');
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

// const courses = [
//     {
//         name: "course 1",
//         teacher: "Juan",
//         duration: 123

//     },
//     {
//         name: "course 2",
//         teacher: "Giorgio",
//         duration: 234

//     },
//     {
//         name: "course 3",
//         teacher: "Diego",
//         duration: 345

//     }
// ];



User.create(users, (err) => {

    if (err) { throw (err) }
    console.log(`Created ${users.length} users`)
    mongoose.connection.close()
});

// Course.create(courses, (err) => {

//     if (err) { throw (err) }
//     console.log(`Created ${courses.length} courses`)
//     mongoose.connection.close()

// });
