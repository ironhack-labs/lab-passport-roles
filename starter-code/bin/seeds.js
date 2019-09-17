const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

mongoose
  .connect("mongodb://localhost/Ironhack0819", { useNewUrlParser: true })
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
    start();
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

function start() {
  const password = 1234;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  let newUser = new User({
    username: "BigBoss",
    password: `${hashPass}`,
    role: "BOSS"
  });
  newUser.save(err => {
    process.exit(0);
  });
}
