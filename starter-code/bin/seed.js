const mongoose = require("mongoose")
const User = require('../models/User.models')
const express = require("express");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const salt = bcrypt.genSaltSync(bcryptSalt)
const hassPass = bcrypt.hashSync('1234', salt)

const dbName = "passport"
mongoose.connect(`mongodb://localhost/${dbName}`)
User.collection.drop()

const boss = [{
  username: "Satan",
  password: hassPass,
  role: 'Boss'
}]

User.create(boss, (err) => {
  if (err) { throw err }
  console.log(`Creado ${boss.length} boss`)
  mongoose.connection.close()
})
