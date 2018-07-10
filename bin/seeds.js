require("dotenv").config();
const bcryptSalt = 10;


const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require('bcrypt');

const dbName = process.env.DBURL;
mongoose.connect(dbName);

const password =  "12345"
const salt = bcrypt.genSaltSync(bcryptSalt);
const hashPass = bcrypt.hashSync(password, salt);

const user = {username: "marc", password: hashPass, role:"BOSS"}
User.collection.drop();

User.create(user).then(() => {
  mongoose.disconnect();
});
