require("dotenv").config();
const mongoose = require("mongoose");

const User = require("../models/User");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const salt = bcrypt.genSaltSync(bcryptSalt);
const hashPass = bcrypt.hashSync("123", salt)

const user_data = [
  {
    username: "Boss",
    password: hashPass,
    role: ['Boss']
  }
]
dbURL= process.env.DBURL;
mongoose.connect(dbURL).then(() =>{
  User.collection.drop();
  console.log(`Connected to db ${dbURL}`);

  User.create(user_data)
  .then((users)=> {
    console.log(users);
    mongoose.disconnect();

  })
  .catch((err) => {
    console.log(err)
  })

});