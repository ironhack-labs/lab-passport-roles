/*jshint esversion: 6 */
const mongoose = require('mongoose');
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const User = require('../models/user');
// const Course = require('../models/course');


mongoose.connect("mongodb://localhost/ibi-ironhack");

let password = "ironhack";
let salt = bcrypt.genSaltSync(bcryptSalt);
let encryptedPass = bcrypt.hashSync(password, salt);

//lets create the boss (need node)
  let boss = new User({
  username: 'theboss',
  name: 'Gonzalo',
  familyName: 'M.',
  password: encryptedPass,
  role: 'BOSS'
});
