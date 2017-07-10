/*jshint esversion: 6 */
const mongoose = require('mongoose');
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const User = require('../models/user');
const Course = require('../models/course');

//connect
mongoose.connect("mongodb://localhost/ibi-ironhack");

let password = "ironhack";
let salt = bcrypt.genSaltSync(bcryptSalt);
let encryptedPass = bcrypt.hashSync(password, salt);

//lets create the boss (need node)
  const BOSS = new User({
  username: 'theboss',
  name: 'Gonzalo',
  familyName: 'M.',
  password: encryptedPass,
  role: 'Boss'
});
