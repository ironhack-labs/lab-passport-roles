const mongoose = require("mongoose");
const User = require("../models/User");

mongoose
  .connect("mongodb://localhost/alumhack", { useNewUrlParser: true })
  .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch(err => console.error("Error connecting to mongo", err));

User.deleteMany()
.then(()=>{
  const users = [
    {
      username: "Estefi",
      password: "estefi",
      role: "Boss",
    },
    {
      username: "Kike",
      password: "kike",
      role: "TA",
    },
    {
      username: "Hector",
      password: "hector",
      role: "Dev",
    },
   
  ];
  
  User.insertMany(users)

})

