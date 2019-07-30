const mongoose = require('mongoose');
const User = require('../models/User');

const dbName = 'Users';

mongoose.connect(`mongodb://localhost/${dbName}`, { useNewUrlParser: true });


const data =  {username: "German",
password: "Ironhack",
role: 'BOSS'}

User.create(data, (err) => {
  if (err) { throw (err) }

  mongoose.connection.close();
});
