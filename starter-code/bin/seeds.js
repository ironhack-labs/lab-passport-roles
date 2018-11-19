const mongoose = require("mongoose")
const User = require("../models/user")
const bcrypt = require("bcrypt")

const password1 = "123";
const saltRounds = 5;
const salt = bcrypt.genSaltSync(saltRounds);
const hashPassBoss = bcrypt.hashSync(password1, salt)

const password2 = "456"
const hashPassTa = bcrypt.hashSync(password2, salt)

const password3 = "789"
const hashPassDeveloper = bcrypt.hashSync(password3, salt)



const user = [
  {
    username: "Don Pepe",
    password: hashPassBoss,
    role: "BOSS"
  }, 
  {
    username: "Medium Pepe",
    password: hashPassTa,
    role: "TA"
  },
  {
    username: "Lil' Pepe",
    password: hashPassDeveloper,
    role: "DEVELOPER"
  }

]

mongoose
  .connect('mongodb://localhost/starter-code', { useNewUrlParser: true })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
    return User.collection.drop();
  })
  .then(() => {
    return User.insertMany(user)
  })
  .then(() => {
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });