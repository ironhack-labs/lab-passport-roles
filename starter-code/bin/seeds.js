require('dotenv').config();
const mongoose = require("mongoose");
const User = require("../models/User");

const users = [
  {
    username: "gonzalo",
    password: "ironhack",
    role: "Boss"
  }
];

  //db connection without callback
  mongoose
  .connect("mongodb://localhost/ironhackers", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);  
    User.deleteMany()
    .then(() => {
      return User.insertMany(users);
    })
    .then(() => {
      console.log("succesfully added all the data");
      mongoose.connection.close();
      process.exit(0);
    });
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  }); 
