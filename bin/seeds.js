const app_name = require("../package.json").name;
const path = require("path");
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const user_data = require("./user_data");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const dbURL = process.env.DBURL;

mongoose.connect(dbURL).then(() => {
  User.collection.drop();

  user_data.forEach(user => {
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(user.password, salt);
    const newUser = new User({
      username: user.username,
      password: hashPass,
      rol: user.rol
    })
      .save()
      .then(() => console.log("CREADO"));
  });
});
