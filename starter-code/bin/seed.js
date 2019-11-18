const mongoose = require("mongoose");
const User = require("../models/Users");

mongoose.connect(`mongodb://localhost/LocalRoles`);

const users = [
  {
    username: "Dani",
    password: "dani",
    role: "BOSS",
  },
  {
    username: "Lorena",
  password: "lorena",
  role: "TA",
  },
  {
    username: "Javier",
  password: "javier",
  role: "DEVELOPER",
  }
];

User.create(users, err => {
  if (err) {
    throw err;
  }
  console.log(`Created ${users.length} users`);
  mongoose.connection.close();
});
