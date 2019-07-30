const mongoose = require('mongoose');
const User = require('../models/User.model')

//const dbtitle = 'celebrity-project';
const dbtitle = 'company-roles'
mongoose.connect(`mongodb://localhost/${dbtitle}`);
//Celebrity.collection.drop();
//Movie.collection.drop()


const users = [
  {
    username: "carlarodriguez",
    password: "55555",
    role: "BOSS"   
  }
]
User.create(users, (err) => {
  if (err) { throw (err) }
  console.log(`Created ${users.length} users`)
  mongoose.connection.close();
});
