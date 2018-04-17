require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/user");
const user_data = require("./user_data");
const dbURL = process.env.dbURL

mongoose.connect(dbURL).then (() => {
  User.collection.drop();
  
  User.create(user_data)
  .then((user) => {
    console.log(`User ${user} inserted`);
    mongoose.disconnect();
  })
  .catch((err) => {
    console.log(err)
  })
})