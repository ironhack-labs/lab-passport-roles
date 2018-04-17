require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const user_data = require("./users_data");

const dbURL = process.env.DBURL;
mongoose.connect(dbURL).then(() => {
  user_data.forEach(user => {
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(user.password, salt);

    const newUser = new User({
      username: user.username,
      password: hashPass,
      role: user.role
    })
      .save()
      .then(() => console.log("Boss data creado"));
  });
  /*     User.create(user);

    console.log("boss creado").then(() => {
        mongoose.disconnect(); */
});
