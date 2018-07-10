const mongoose = require('mongoose');
const Employee = require('../models/employee');
const bcrypt = require('bcrypt');

var salt = bcrypt.genSaltSync(10);
var hashBoss = bcrypt.hashSync('1234', salt);

mongoose.connect('mongodb://localhost/lab-passport-roles', {useMongoClient: true})
.then(() => {
    const boss = new Employee({
        username: "Marc",
        password: hashBoss,
        role: 'Boss'
    })
    return boss.save();
})
.then(() => {
    mongoose.disconnect();
})
.catch(err => console.log(err));