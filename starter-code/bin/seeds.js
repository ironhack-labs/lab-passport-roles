const mongoose = require ('mongoose');
const bcrypt = require ('bcryptjs');
const User = require ('../models/User');
mongoose.connect ('mongodb://localhost/passport-roles');
const salt = bcrypt.genSaltSync (10);
const hashPass = bcrypt.hashSync('putin', salt);

const bossUser = [{
    username: 'Putin',
    password: hashPass,
    role: 'BOSS',
  }];
  
User.insertMany (bossUser)
  .then (() => {
    console.log ('Created');
  })
  .catch (error => {
    console.log (error);
  });
