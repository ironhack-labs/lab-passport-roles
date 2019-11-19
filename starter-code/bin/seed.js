const mongoose = require('mongoose');
const User = require('../models/User.model');
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const dbName = 'gadget-app';
mongoose.connect(`mongodb://localhost/${dbName}`);


const users =
   
    {
        username: "Luis",
        password: "cat",
        role: "BOSS"
    }




   const salt = bcrypt.genSaltSync(bcryptSalt);
   const hashPass = bcrypt.hashSync(users.password, salt);

User.create({
    username: users.username, password: hashPass, role: users.role })
    .then(newUser => console.log("Boss created"))
    .then(() =>     mongoose.connection.close())
    .catch(err => console.log("Error al pasar el new user", err))
    
