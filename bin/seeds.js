const mongoose    = require('mongoose');
const User       = require('../models/User');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;


const basicpassword = "1234";
const salt = bcrypt.genSaltSync(bcryptSalt);
const hashPass = bcrypt.hashSync(basicpassword, salt);

const user = [
  { username: "rvalenzuela",
    password: hashPass,
    role: ["Boss"]
  },
]
mongoose
  .connect('mongodb://localhost/lab-passport-roles', {useMongoClient: true})
  .then(() => {      
    console.log(`Conectado a Mongo... insertando los siguientes registros: ${user}`)  
    User.create(user)
      .then ((arrUser) => {
        mongoose.disconnect();
        console.log(`Inserción exitosa de los siguientes registros: ${arrUser}`)
      })
    
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });
