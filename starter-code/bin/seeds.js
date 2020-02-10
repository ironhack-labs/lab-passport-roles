const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const password = '1234';

const salt  = bcrypt.genSaltSync(saltRounds);
const hash = bcrypt.hashSync(password, salt);

const boss = {
    username: 'iamthefuckingboss',
    password: hash,
    role: 'Boss'
}


// db connection
function dbConnect(cb) {
    mongoose
        .connect("mongodb://localhost/passport-roles", { useNewUrlParser: true, useUnifiedTopology: true })
        .then(x => {
        console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
        cb();
        })
        .catch(err => {
        console.error("Error connecting to mongo", err);
        });
}

dbConnect(() => {
    User.deleteMany()
    .then(() => {
        return User.create(boss) 
    })
    .then(() => {
        console.log("succesfully added all the data");
        mongoose.connection.close();
        process.exit(0);
    });
});