require("dotenv").config();
const dbURL = process.env.DBURL;

const mongoose = require("mongoose");
const User = require("../models/User");
const user_data = require("./user_data");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

mongoose.connect(dbURL)
  .then( () => {
    /* debug(`Connected to DB ${dbURL}`); */
    User.collection.drop();

    user_data.forEach(user => {
      const salt = bcrypt.genSaltSync(bcryptSalt,);
      const hashPass = bcrypt.hashSync(user.password, salt);
      const newUser = new User({
        username: user.username,
        password: hashPass,
        role: user.role
      })
        .save()
        .then(() => console.log("User created"))
        .catch(err => console.log(err));
    })
      
  })
  .catch( err => console.log( err ))

