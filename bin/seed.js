const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const dbName = "lab-passport-roles";
mongoose.connect(`mongodb://localhost/${dbName}`);

const users = [
  {
    username: "Boss",
    password: "test",
    role: "Boss"
  }
];

// users.map(user => {
//   hashPassword(user);
// });

User.create(users, err => {
  if (err) {
    throw err;
  }
  console.log(`Created ${users.length} users`);
  mongoose.connection.close();
});

function hashPassword(user) {
  const encrypted = bcrypt.hashSync(user.password, 10);

  user.password = encrypted;
}
