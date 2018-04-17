require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcrypt");
let pass = "1234";
let salt = 10;
let password = bcrypt.hashSync(pass, salt);
// Store hash in your password DB.
console.log(password);

const user_data = {
  username: "LeMarc",
  password: password,
  role: "Boss"
};

const dbURL = process.env.DBURL;

mongoose.connect(dbURL).then(() => {
  console.log(`Connected to db ${dbURL}`);
  User.create(user_data).then(() => {
    console.log("Boss created");
    mongoose.disconnect();
  });
});
