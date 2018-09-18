const User = require("../models/user.js");
const mongoose = require("mongoose");


mongoose.connect("mongodb://localhost/mongoose-users")

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




User.create(users)
  .then(() => console.log("Users collection seeded"))
  .then(() => mongoose.disconnect())
  .catch(err => console.log(err))