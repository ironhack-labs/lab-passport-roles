const mongoose = require("mongoose");

const User = require("../models/user.model");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const salt = bcrypt.genSaltSync(bcryptSalt);
const hashPass = bcrypt.hashSync("1234", salt)

mongoose.connect("mongodb://localhost/educationPlatform", {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const boss = [{
  username: "ruben",
  password: hashPass,
  role: "BOSS"
}];

User.insertMany(boss)
  .then(loadedBoss => console.log(loadedBoss))
  .catch(err => console.log("Error al subir los celebrities tipo", err));


// password: bcrypt.hashSync("1234", salt),