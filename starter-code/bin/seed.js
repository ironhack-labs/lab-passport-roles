const User = require('../models/user');
const mongoose = require('mongoose')

const boss = {
  username: 'jefaso',
  password: '1',
  rol: 'Boss',
};




mongoose.connect(`mongodb://localhost/IBI`, {
  useNewUrlParser: true
})
  .then(() => User.collection.drop())
  .catch(err => console.log(`error deleting data: ${err}`))
  .then(() => User.create(boss))
  .catch(err => console.log(`error creating data: ${err}`))
  .finally(() => mongoose.disconnect())


