const mongoose = require("mongoose")
const User = require("../models/user")

const bcrypt = require("bcrypt")
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

const passBoss = "1234";
const hashPassBoss = bcrypt.hashSync(passBoss, salt)

const passDev= "1234"
const hashPassDev = bcrypt.hashSync(passDev, salt)

const passTA = "1234"
const hashPassTA = bcrypt.hashSync(passTA, salt)

const users = [
  {
    username: "Iron Hack",
    password: hashPassBoss,
    role: "Boss"
  }, 
  {
    username: "Dani",
    password: hashPassDev,
    role: "Developer"
  },
  {
    username: "Sito",
    password: hashPassTA,
    role: "TA"
  }
]

mongoose
  .connect('mongodb://localhost/roles', { useNewUrlParser: true })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
    User.insertMany(users)
    .then(user=>{console.log('insert user')})
    .catch(error=>{console.log('error')})
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  }); 

