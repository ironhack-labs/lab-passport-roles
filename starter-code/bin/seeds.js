const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

let salt = bcrypt.genSaltSync(10);
let hash = bcrypt.hashSync('boss', salt)

const users = [{name: "Jesus", password: hash, role: "Boss"}]

mongoose.connect('mondodb://localhost/day1week5')
.then(() => User.insertMany(users).then().catch())
.catch(err => {console.log(err)})