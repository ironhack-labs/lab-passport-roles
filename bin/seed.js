const mongoose = require('mongoose');
const User = require("../models/user");
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;

mongoose.connect(`mongodb://localhost/lab-passsport-roles`);

const salt     = bcrypt.genSaltSync(bcryptSalt);
const hashPass = bcrypt.hashSync('admin', salt);

const newUser = User({
  username: "admin",
  password: hashPass,
  role: 'BOSS'
})

newUser.save()
.then(()=>{
  console.log("User admin añadido...");
})
.catch((err)=>{
  console.log(err);
});