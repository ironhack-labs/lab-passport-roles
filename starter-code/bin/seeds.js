const mongoose = require("mongoose");
const Users = require("../models/user");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

mongoose
  .connect("mongodb://localhost/seeds", { useNewUrlParser: true })
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
    start();
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

let userSeed = [
  {
    username: "Dani",
    password: "Vicario",
    role: "Boss"
  },
  {
    username: "Sito",
    password: "Actor",
    role: "TA"
  },
  {
    username: "Carlos",
    password: "putoclave",
    role: "TA"
  },
  {
    username: "Luca",
    password: "SESEESE",
    role: "TA"
  }
];

const salt = bcrypt.genSaltSync(bcryptSalt);
userSeed = userSeed.map(user => {
  return {...user, password: bcrypt.hashSync(user.password, salt)}
})

console.log(userSeed)

function start() {
  Users.deleteMany()
    .then(deleted => {
      return Users.deleteMany();
    })
    .then(usersDroppedInfo => {
      Users.create(userSeed).then(addedStudents => {
        process.exit(0);
      });
    })
    .catch(error => {
      console.log(error);
    });
}
