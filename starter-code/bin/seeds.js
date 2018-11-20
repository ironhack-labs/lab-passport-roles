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
    const hashPass = bcrypt.hashSync(password, salt);

    var newBoss = new User({
      username: "Reverte",
      password: hashPass,
      role: "BOSS"
    })
    var newDeveloper = new User ({
      username: "Miua",
      password: hassPass,
      role: "developer" 
    })
    var newTA = new User ({
      username: "Carlos",
      password: hassPass,
      role: "TA"

    })
   
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });