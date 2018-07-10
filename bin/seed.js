const mongoose = require("mongoose");
const User = require("../models/User");
const dbName = "lab-passport-roles";

mongoose.connect("mongodb://localhost/"+dbName);

const boss = [{
    username:"Rich",
    role:"BOSS"
}]

User.create(boss)
  .then(boss =>{
    mongoose.connection.close();
    console.log(`Created ${boss.length} boss`);
    })
  .catch(e=>{throw (e)});

