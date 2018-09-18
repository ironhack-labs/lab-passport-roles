const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const bossInitialPassword = "boss";
const salt = bcrypt.genSaltSync(saltRounds);
const hash1 = bcrypt.hashSync(bossInitialPassword, salt);

const users = [
  {
    username: "The Boss",
    password: hash1,
    role: "BOSS"
  }
];

mongoose
  .connect(
    "mongodb://localhost/lab-passport-roles",
    { useNewUrlParser: true }
  )
  .then (() => {console.log("Connected to Mongo!"); User.collection.drop()})
  .then (() => User.insertMany(users))
  .then (() => {mongoose.disconnect()})
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });
