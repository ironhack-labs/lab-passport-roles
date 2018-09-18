const mongoose = require("mongoose");
const User = require("../models/User");
    
const employees =[
    {
        username: "Boss",
        password: "1234",
        role: "Boss"
    },
    {
        username: "Dev1",
        password: "1234",
        role: "Developer"
    },
    {
        username: "Ta",
        password: "1234",
        role: "TA"
    }]

    mongoose
    .connect('mongodb://localhost/lab-passport-roles', { useNewUrlParser: true })
    .then(x => {
  
      User.collection.drop().then(() => {
      }).catch(e => console.log(e))
      User.insertMany(employees).then(emp => {
        console.log(emp);
      }).catch(e => console.log(e))
    })
    .catch(err => {
      console.error("Error connecting to mongo", err);
    });