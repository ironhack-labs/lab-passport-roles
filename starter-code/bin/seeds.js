const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const User = require("../models/usermodel")
const bcryptSalt = 10

mongoose.connect("mongodb://localhost/lab-passport", {
    useNewUrlParser: true
  })
  .then(x => {

    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}`)

  })
const password = `1234`
const salt = bcrypt.genSaltSync(bcryptSalt);
const hashPass = bcrypt.hashSync(password, salt);

const boss = {
  username: "Dani",
  password: hashPass,
  role: "Boss"
}


User.deleteMany()
.then(() => {
  console.log(`Old data deleted`)
  return User.create(boss)
})
.then(() => {
  console.log(`Data created successfully`)
  mongoose.connection.close();
  process.exit(0)
})
