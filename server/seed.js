'use strict';

require('dotenv').config();


const User = require('./../models/user');
const database = require('./database');

const URI = process.env.MONGODB_URI;

database.connect({ uri: URI})
.then(() => {
  return User.deleteMany({});
})
.then(() => {
  return User.create({username: 'Boss', role: 'Boss', password: 'password'});
})
.then(user => {
  console.log('Seeded the database with a boss user.', user);
})
.then(database.disconnect)
//then(() => database.dissconnect())
.catch(error => {
  console.error(`There was an error connecting the database to URI "${ URI }"`, error);
  process.exit(1);
});