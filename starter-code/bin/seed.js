const mongoose = require('mongoose')
const User = require('../models/user.model')
const bcrypt = require("bcrypt")
const bcryptSalt = 10

const dbName = 'starter-code';
mongoose.connect(`mongodb://localhost/${dbName}`)



const salt = bcrypt.genSaltSync(bcryptSalt)
const hashPass = bcrypt.hashSync("supervisor", salt)

const user = [
    {
      username : "Supervisor",
      password: hashPass,
      role: "BOSS"
    }
  ]


  User.create(user, (err) => {
    if (err) { throw (err) }
    console.log(`Created ${user.length} user`)
    mongoose.connection.close()
  })