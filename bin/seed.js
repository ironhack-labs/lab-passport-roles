const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); 

const User = require("../models/user-model");


mongoose.Promise = Promise;
mongoose
  .connect("mongodb://localhost/lab-passport-roles", { useMongoClient: true })
  .then(() => {
    console.log("Connected to Mongo!");
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
});

const users = [
    {
    username: "DoeBoss",
    name: "John Doe",
    role: "Boss",
    password: "DoeBoss95" 
    }
]

users.forEach(user => {
 const { username, name, role, password } = user;
 const salt = bcrypt.genSaltSync(10);
 encryptedPassword = bcrypt.hashSync( password,salt );

    User.create({username, name, role, encryptedPassword })
    .then((userDet)=>{
        console.log(userDet);
    })
    .catch((err)=>{
        console.log("err", err);
    })
})