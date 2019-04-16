require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt= require('bcrypt'); 

const dbName = `${process.env.DATABASE}`;

mongoose
  .connect(`mongodb://localhost/${dbName}`, {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

  const users = [
    {username: "elmasca",
    name: "Masca",
    surname: "Brown",
    address: "Palace Street 666",
    password: `${bcrypt.hashSync('password', 10)}`,
    role: "Boss"
    }
  ];


User.create(users)
.then(usersInserted => {
  console.log(`Created ${usersInserted.length} users`);
  mongoose.connection.close();
})
.catch(err => {
  console.log(err)
}) 