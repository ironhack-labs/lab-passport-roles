
const mongoose = require('mongoose');
const User = require('../models/user');

const dbName = 'lab-passport-roles';
mongoose.connect(`mongodb://localhost/${dbName}`);

const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const salt = bcrypt.genSaltSync(bcryptSalt);

const boss = new User({
  username: "boss",
  password: bcrypt.hashSync("boss", salt),
  role: "Boss"
});


User.deleteMany()
  .then(() => User.create(boss))
  .then(userDocuments => {
    console.log(`Created the boss.`)
    mongoose.connection.close()
  })
  .catch(err => {throw(err)})