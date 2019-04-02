const mongoose = require("mongoose");
const User =require ("../models/User");
//const passport = require("passport");
const passport     = require("../helpers/passport");

mongoose
  .connect('mongodb://localhost/starter-code', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

// To insert in "bin/seeds.js"

//User.collection.drop();

const bcrypt = require('bcrypt');
const bSalt = 10;
const salt = bcrypt.genSaltSync(bSalt);
const password = '1';
const Epass = bcrypt.hashSync(password,salt);


const seed = {name: "BOSS", role: "BOSS", password: 1}

  /*
  User.create(users)
  .then(users =>{
      console.log(`se crearon ${users.length}  registros`);
      mongoose.connection.close()
  })
  .catch(err =>{
      console.log(err);
  })
  */

  User.register({ name:'BOSS', role:'BOSS' }, '1');