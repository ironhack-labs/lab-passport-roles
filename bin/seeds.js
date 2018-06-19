const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require('bcrypt');

mongoose .connect('mongodb://localhost/lab-passport-roles')//, {useMongoClient: true})
  // .then(() => {
  //   console.log('Connected to Mongo!')
  // }).catch(err => {
  //   console.error('Error connecting to mongo', err)
  // });

const bycryptSalt = 10;

function pwdGen(password){
  bcrypt.hash(password, bycryptSalt, (err, pwd) =>{
    if (err) 
      throw err;
    console.log(pwd);
    return pwd;
  })  
}


let newUser = {
  username: "iamtheboss",
  password: "$2b$10$0v3i222J4gCyXbicmOcfFO1SYOxpbmQ7IS1E97pJ/S/DMi3rCtvQG",
  role: "Boss"
}

User.create(newUser)
  .then( user =>{
    console.log(user);
    mongoose.disconnect();
  })
  .catch( err => {throw err} );
