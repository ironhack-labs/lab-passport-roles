require('dotenv').config();
const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcrypt");

// hash

const saltRounds = 10;
const plainPassword1 = "1234";

const salt  = bcrypt.genSaltSync(saltRounds);
const hash1 = bcrypt.hashSync(plainPassword1, salt);


const user = [{
    username: "Manu",
    password: hash1,
    role: "Boss"
  }

];




mongoose
  .connect('mongodb://localhost/passport-roles', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
    User.deleteMany()
      .then(() => {
        return User.create(user);
      })
      .then(() => {
        console.log("succesfully added all the data");
        mongoose.connection.close();
        process.exit(0);
      });
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });