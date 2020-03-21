const User = require("../models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

mongoose
  .connect("mongodb://localhost/lab-passport-roles", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

bcrypt.hash("bossman", 10).then(hash => {
  User.create({
    username: 'Boss',
    password: hash,
    role: "BOSS"
  })
    .then(() => {
      mongoose.disconnect();
    })
    .catch(e => console.log(e));
});
