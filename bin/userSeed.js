require("dotenv").config();

const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const mongoose = require("mongoose");
const User = require("../models/User");
const dbURL = process.env.DBURL;

const salt = bcrypt.genSaltSync(bcryptSalt);
const hashPass = bcrypt.hashSync("1234", salt);

const boss = [
  {
    username: "Marc",
    password: hashPass,
    role: "Boss",
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
];

mongoose.connect('mongodb://localhost/lab-passport-roles').then(() => {console.log('Connected to Mongo!')})

User.create(boss,(err,boss)=>{




  if(err){
    throw err;
  }
  console.log(boss)
})





