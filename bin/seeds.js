const mongoose = require("mongoose");
const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const salt = bcrypt.genSaltSync(bcryptSalt);

mongoose.connect("mongodb://localhost/lab-passport-roles");

const users = [
  {
    username: "ourBoss",
    password: `${bcrypt.hashSync("ourBoss", salt)}`,
    role: "Boss"
  },
  {
    username: "TA",
    password: `${bcrypt.hashSync("TA", salt)}`,
    role: "TA"
  }
];

User.deleteMany()
  .then(() => User.create(users))
  .then(usersDocuments => {
    console.log(`Created ${users.length} users`);
    mongoose.connection.close();
  })
  .catch(err => {
    throw err;
  });
