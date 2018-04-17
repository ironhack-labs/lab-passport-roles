require("dotenv").config();
const mongoose = require("mongoose");

const User = require("../models/User");

const user_data = [
  {
    username: "Boss",
    password: "123",
    role: ['Boss']
  }
]
dbURL= process.env.DBURL;
mongoose.connect(dbURL).then(() =>{
  User.collection.drop();
  console.log(`Connected to db ${dbURL}`);

  User.create(user_data)
  .then((users)=> {
    console.log(users);
    mongoose.disconnect();

  })
  .catch((err) => {
    console.log(err)
  })

});