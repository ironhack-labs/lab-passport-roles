const path = require('path');
const dotenv = require('dotenv');
dotenv.config({path: path.join(__dirname, '.private.env')});

const mongoose =  require('mongoose');

const User = require('../models/User');
const Course = require('../models/Course');

const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
const hashPass = bcrypt.hashSync("1234", salt);


mongoose.connect(process.env.DBURL, {useNewUrlParser: true})
  .then(() => console.log(`Connected to ${process.env.DBURL}!`));

const boss = {
  username: 'General Manager',
  password: hashPass,
  role: "Boss",
  slack_id: null,
  facebookID: null
};

const ta = {
  username: 'Teacher Assistant',
  password: hashPass,
  role: "TA",
  slack_id: null,
  facebookID: null
};

const course = {
  name: 'Basic auth with express',
  creator: 'Gillian'
};

User.collection.drop();
Course.collection.drop();

User.create(boss)
  .then(boss => {
    console.log(`Created boss!`);
  }).then(() => {mongoose.disconnect()});

User.create(ta)
  .then(ta => {
    console.log(`Created TA!`);
  }).then(() => {mongoose.disconnect()});

Course.create(course)
  .then(course => {
    console.log(`Created course!`);
  }).then(() => {mongoose.disconnect()});
