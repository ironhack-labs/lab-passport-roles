require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const salt = bcrypt.genSaltSync(bcryptSalt);

mongoose.connect(process.env.DBURL);

User.collection.drop();

const hashPass = bcrypt.hashSync("1111", salt);
User.create([{ username: "Marc", password: hashPass, role: "Boss" }])
  .then(boss => {
    console.log("Boss added");
    mongoose.disconnect();
  })
  .catch(err => {
    console.log("Failed to add Boss");
  });
