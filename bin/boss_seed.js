require("dotenv").config();

const mongoose = require('mongoose');
const User = require('../models/User');
const boss_data = require('./boss_data');

const dbURL = "mongodb://localhost/lab-passport-roles";

mongoose.connect(dbURL).then(() => {
  console.log(`Conected to db ${dbURL}`);

  mongoose.connection.db.dropCollection("users").then(() => {
    console.log("Collection deleted");

    boss_data.forEach(e => {
      let boss = new User({
        username: e.username,
        password: e.password,
        role: e.role
      })
        .save()
        .then(() => {
          console.log("Boss created");
          mongoose.disconnect();
        });
    });
  });
});