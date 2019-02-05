const mongoose = require("mongoose");
const User = require("../models/user");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

mongoose
  .connect("mongodb://localhost/passport-roles", { useNewUrlParser: true })
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

const salt = bcrypt.genSaltSync(bcryptSalt);
const hashPass = bcrypt.hashSync("1234", salt);

const boss = new User({
  username: "bigboss",
  password: hashPass,
  role: "Boss"
});

boss.save(err => {
  if (err) console.log(err);
  else {
    console.log("like a boss!");
    mongoose.connection.close();
  }
});
