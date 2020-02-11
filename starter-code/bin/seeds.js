
  require('dotenv').config();
  const mongoose = require("mongoose");


  function dbConnect(cb) {
    mongoose
      .connect("mongodb://localhost/staffs", { useNewUrlParser: true, useUnifiedTopology: true })
      .then(x => {
        console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
        cb();
      })
      .catch(err => {
        console.error("Error connecting to mongo", err);
      });
  };

  dbConnect(() => {
  const User = require("../Models/user");
  const users = [
    {
      username: "Armando Maradona",
      password: "3910",
      role: "BOSS"
    }
  ];

  
 
  
  User.deleteMany()
    .then(() => {
      return User.create(users);
    })
    .then(() => {
      console.log("succesfully added all the data");
      mongoose.connection.close();
      process.exit(0);
    });
  });