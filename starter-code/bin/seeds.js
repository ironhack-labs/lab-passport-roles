const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const plainPassword = `injaqueable69`;
const salt = bcrypt.genSaltSync(saltRounds);
const hash = bcrypt.hashSync(plainPassword, salt);

function dbConnect(cb) {
  mongoose
    .connect("mongodb://localhost/IBI", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(x => {
      console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
      cb();
    })
    .catch(err => {
      console.error("Error connecting to mongo", err);
    });
}

dbConnect(() => {

  const User = require("../models/User");

  User.deleteMany()
    .then(() => {
      return User.create({
        name: `General Manager`,
        password: hash,
        role: 'Boss'
      });
    })
    .then(() => {
      console.log("succesfully added all the data");
      mongoose.connection.close();
      process.exit(0);
    });
});