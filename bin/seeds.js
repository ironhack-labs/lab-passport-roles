const mongoose = require("mongoose");
const User = require("../models/user");
const dbName = "lab-passport-roles";
const bcrypt = require("bcrypt");
const bossPassword = "vigo";
const bcryptSalt = 10;
const salt = bcrypt.genSaltSync(bcryptSalt);
const hashPass = bcrypt.hashSync(bossPassword, salt);


mongoose.connect(`mongodb://localhost/${dbName}`);


const users = [{
    username: "Rubén",
    password: hashPass,
    role: "Boss",
  }
];


User.collection.drop();
 


User.create(users, err => {
  if (err) {
    throw err;
  }
  console.log(`Created ${users.length} users`);
  mongoose.connection.close();
});