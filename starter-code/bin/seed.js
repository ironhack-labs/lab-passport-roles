require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const salt = bcrypt.genSaltSync(bcryptSalt);

const userArray = [
    {
        username: "Usuario1",
        password: "test",
        role: "BOSS"
    },
    {
        username: "Usuario2",
        password: "test",
        role: "DEVELOPER"
    },
    {
        username: "Usuario3",
        password: "test",
        role: "TA"
    },
    {
        username: "Usuario4",
        password: "test",
        role: "TA"
    },
    {
        username: "Usuario5",
        password: "test",
        role: "DEVELOPER"
    },
    {
        username: "Usuario6",
        password: "test",
        role: "TA"
    }
  ]

for(var i=0;i<userArray.length;i++){
    userArray[i].password = bcrypt.hashSync(userArray[i].password, salt);
}

mongoose.connect(process.env.DB)
.then(() => {
  console.log("Connected to mongoose");
})
.then(() => {
  return User.create(userArray)
})
.then(users => {
  console.log(users);
  mongoose.connection.close();
})