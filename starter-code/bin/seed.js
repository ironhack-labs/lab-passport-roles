require("dotenv").config()

const mongoose = require("mongoose")
const User = require("../models/user.model")

const bcrypt = require("bcrypt")
const bcryptSalt = 10

mongoose.connect(`mongodb://localhost/${process.env.DB}`)

const user =
{
  name: "boss",
  password: "boss",
  role: "Boss"
}

const salt = bcrypt.genSaltSync(bcryptSalt)
const hashPass = bcrypt.hashSync(user.password, salt)

user.password = hashPass

User.create(user)
  .then(newUsers => console.log("Users have been cerated successfully: ", newUsers))
  .then(x => mongoose.connection.close())
  .catch(err => console.log("An error have occurred: ", err))

