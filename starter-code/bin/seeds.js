const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
dotenv.config({
  path: path.join(__dirname, '.private.env')
});

const mongoose =  require('mongoose');
const User = require('../models/User');
const bcrypt = require("bcryptjs");

const salt = bcrypt.genSaltSync(10);
const hashPass = bcrypt.hashSync("1234", salt);


mongoose.connect( process.env.DBURL, {useNewUrlParser: true})
  .then(() => console.log(`Connected to ${ process.env.DBURL}!`));

const boss = {
  username: 'General Manager',
  password: hashPass,
  role: "Boss",
  slack_id: null
};

User.collection.drop();

User.create(boss)
  .then(boss => {
    console.log(`Created boss!`);
  }).then(() => {mongoose.disconnect()});
