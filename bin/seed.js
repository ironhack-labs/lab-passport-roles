const User = require("../models/user.js");
const mongoose = require("mongoose");
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;


mongoose.connect("mongodb://localhost/ironhack-school")

const users = [
  {
    name: "Custodio Fulgencio",
    surname: "The Boss",
    username: "SuperBoss",
    password: "12345",
    role: "Boss"
  },
  {
    name: "Alfalfa",
    surname: "Alf",
    username: "Deve",
    password: "12345",
    role: "Developer"  
  },
  {
    name: "Amadeo",
    surname: "Yoloyolo",
    username: "Profe",
    password: "12345",
    role: "TA" 
  },
  {
    name: "Umno",
    surname: "Al",
    username: "Alumno",
    password: "12345",
    role: "Alumni" 
  },
];


const finalUsers = users.map(e => {
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(e.password, salt);
  e.password = hashPass
  return e
})

User.collection.drop()

User.create(finalUsers)
  .then(() => console.log("Users collection seeded"))
  .then(() => mongoose.disconnect())
  .catch(err => console.log(err))