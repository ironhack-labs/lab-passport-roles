const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcrypt");
mongoose.connect(`mongodb://localhost/user`);
const passwords = "password";
const saltRounds = 5;
const salt = bcrypt.genSaltSync(saltRounds);
const hash = bcrypt.hashSync(passwords, salt);

const users = [
  {
    username: "Perico",
    role: "BOSS",
    password: hash
  },
  {
    username: "Eusebio",
    role: "DEVELOPER",
    password: hash
  },
  {
    username: "Hilario",
    role: "TA",
    password: hash
  }
];
User.create(users)
  .then(() => console.log("Users created"))
  .then(() => mongoose.disconnect());
