require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const salt = 10;
const bSalt = bcrypt.genSaltSync(salt);
const pass = "12345";
const hashPass = bcrypt.hashSync(pass, bSalt);

mongoose.connect(`mongodb://localhost/${process.env.DB}`);
const users = [
  {
    username: "12345",
    password: `${hashPass}`,
    rol: "Boss"
  }
];
User.create(users)
  .then(usersCreated => {
    console.log(`Added ${usersCreated.length} Ironhacker`);
    mongoose.connection.close();
  })
  .catch(err => console.log(`Error en seed: ${err}`));
