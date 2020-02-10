const mongoose = require("mongoose");
// db connection
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

function dbConnect(cb) {
  mongoose
    .connect("mongodb://localhost/BOSS", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(x => {
      console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
      cb();
    })
    .catch(err => {
      console.error("Error connecting to mongo", err);
    });
}

dbConnect(() => {
  const Boss = require('../models/boss');
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync('boss', salt);
  
  const boss = {
    username: 'boss',
    password: hashPass,
    role: 'BOSS'
  }
  Boss.deleteMany()
    .then(() => {
      return Boss.create(boss)
    })
    .then(() => {
      console.log('succesfully added the BOSS to te data')
      mongoose.connection.close()
      process.exit(0)
    })
})