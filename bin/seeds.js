const mongoose = require ("mongoose");
const User = require ("../models/User");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

mongoose
  .connect('mongodb://localhost/lab-passport-roles', {useMongoClient: true})
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync("12345", salt);

  const users = [{
    username : "GeneralManager",
    password: hashPass,
    role : "BOSS"

  }]

  User.collection.drop();

  User.create(users, (err)=> {
    if(err){throw(err)}
    console.log("created boss user")
    mongoose.connection.close();
  })

