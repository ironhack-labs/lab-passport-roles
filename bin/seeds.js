const mongoose = require("mongoose");
const User = require("../models/User.js");

const dataUsers = [
  {
    username: "TheBoss",
    password: "1234",
    role: "BOSS"
  }
];

mongoose
  .connect(
    "mongodb://localhost/lab-passport-roles",
    { useNewUrlParser: true }
  )
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .then(() => {
    User.collection.drop();
    User.insertMany(dataUsers);
  })
  .then(() => {
    mongoose.disconnect();
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });
