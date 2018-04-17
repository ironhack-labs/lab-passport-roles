require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const user = [
  {
    username: "Esther",
    password: "1234",
    role: "Boss"
  }
];

const dbURL = process.env.DBURL;
mongoose.connect(dbURL).then(() => {
    User.create(user);
    console.log("boss creado").then(() => {
        mongoose.disconnect();
    })
})
