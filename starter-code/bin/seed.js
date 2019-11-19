const mongoose = require('mongoose');
const User = require('../models/User.model');

const dbName = 'ironhack';
mongoose.connect(`mongodb://localhost/${dbName}`);

const bcrypt = require("bcrypt");
const bcryptSalt = 10; 

User.collection.drop();


const salt = bcrypt.genSaltSync(bcryptSalt);
const hashPass = bcrypt.hashSync("sandra", salt);


const user = [{
    username: "sandra",
    password: hashPass,
    role: "BOSS"
  }
]

User.create(user, (err) => {
  if (err) {
    throw (err)
  }
  console.log(`Created ${user.length} user`)
  mongoose.connection.close();
})