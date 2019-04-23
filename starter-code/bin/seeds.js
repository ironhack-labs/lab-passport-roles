require('dotenv').config()

const mongoose  = require('mongoose')
const User = require('../models/User')

mongoose.connect(process.env.DB)

const users = [
  {email: "boss@ibi.com",role:"BOSS"},
]

User.create(users)
  .then(users=>{
    console.log(`Created ${users.length} users successfully`);
    mongoose.connection.close()
  })
  .catch(err=>{
    console.log(err)
  })