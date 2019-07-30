const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/user.js");
mongoose.connect(`mongodb://localhost/${process.env.DB}`, {
  useNewUrlParser: true
});
User.collection.drop();
const bcryptSalt = 10;
const salt = bcrypt.genSaltSync(bcryptSalt);
const hashPass = bcrypt.hashSync("pasta", salt);
const boss = [
  {
    username: "dani",
    password: hashPass,
    role: "BOSS"
  }
];

User.create(boss, err => {
  if (err) {
    throw err;
  }
  console.log(`Created boss ${boss.username}`);
  mongoose.connection.close();
});
