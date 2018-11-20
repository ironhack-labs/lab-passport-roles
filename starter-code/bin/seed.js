const mongoose = require('mongoose');
const User = require('../public/models/user');

const dbName = 'Roles';
mongoose.connect(`mongodb://localhost/${dbName}`);

const users = [
  {
    username : 'rick',
    password : '123',
    rol  : 'boss',
  },
  {
    username : 'morty',
    password : '123',
    rol  : 'developer',
  },
  {
    username : 'sumemr',
    password : '123',
    rol  : 'ta',
  },
];

Celebrity.create(celebrities, (err) => {
  if (err) { throw (err); }
  console.log(`Added ${celebrities.length} celebrities`);
  mongoose.connection.close();
});
