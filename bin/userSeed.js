require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../models/User");
const dbURL = process.env.DBURL;

const boss = [
  {
    username: "Marc",
    password: 1234,
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





