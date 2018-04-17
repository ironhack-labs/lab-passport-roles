require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../models/user");
const users = require("./data");
const dbURL = process.env.DBURL;
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;

mongoose.connect(dbURL).then(() => {
  console.log(`Connected to db ${dbURL}`);
  //Movie.collection.drop();
  console.log(users);
  users.forEach(user => {
    console.log(user);
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(user.password, salt);

    let user_new = new User({
      username: user.username,
      password: hashPass,
      role: user.role
    })
      .save()
      .then(() => console.log("Created user"));
  });
});
