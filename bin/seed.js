require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../models/user");
const data = require("./data");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const dbURL = process.env.DBURL;

mongoose
  .connect(dbURL)
  .then(() => {
    console.log(`Connected to db ${dbURL}`);
    User.collection.drop();
    //then coge data de la iteración anterior

    data.forEach(e => {
      const salt = bcrypt.genSaltSync(bcryptSalt);
      let user = new User(e);
      const hashPass = bcrypt.hashSync(e.password, salt);
      user.password = hashPass;
      return user.save();
    });
  })
  
  .catch(err => {
    console.log(err);
  });
