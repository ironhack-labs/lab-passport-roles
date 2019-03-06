/*jshint esversion: 6 */

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const users = [{
        username: 'TheFuckingBoss',
        password: 'qwerty',
        role: 'Boss'
    }


]

mongoose.connect(process.env.DB)
    .then(() => {
        console.log("connect to mongoose");
        console.log(users)

    })
    .then(() => {
        return User.insertMany(users)
    })
    .then(users => {
        console.log(users);
        mongoose.connection.close();
    })