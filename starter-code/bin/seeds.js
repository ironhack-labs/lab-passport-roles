const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcrypt");

mongoose
  .connect(
    "mongodb://localhost/starter-code",
    { useNewUrlParser: true }
  )
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
    let password = '1234';
    const saltRounds = 10;
    const salt  = bcrypt.genSaltSync(saltRounds);
    const hashPwd = bcrypt.hashSync(password, salt);
    var newUser = new User({
      username: "Bob",
      password: hashPwd,
      role: "BOSS"
    });
   
    newUser.save().then(newUser => {
      mongoose.connection.close()
    });
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });
