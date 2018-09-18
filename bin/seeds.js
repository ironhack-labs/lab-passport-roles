const mongoose = require ("mongoose");
const User = require ("../models/User")

mongoose
  .connect('mongodb://localhost/lab-passport-roles', {useMongoClient: true})
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });


  const users = [{
    name : "General Manager",
    role : "BOSS"

  }]

  User.collection.drop();

  User.create(users, (err)=> {
    if(err){throw(err)}
    console.log("created boss user")
    mongoose.connection.close();
  })

