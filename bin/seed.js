
const mongoose = require('mongoose');
const User = require('../models/user.model');
const bcrypt = require("bcryptjs")
const bcryptSalt = 10


const salt = bcrypt.genSaltSync(bcryptSalt)
const password = "contraseña"
const hashPass = bcrypt.hashSync(password, salt)

const dbName = 'dbw5d1Passport';
mongoose.connect(`mongodb://localhost/${dbName}`);

const users = [
    {
        username: "Jefazo",
        name: "jefecito",
        password: hashPass,
        profileImg: "https://www.lafinestradigital.com/wp-content/uploads/2017/04/bebejefazo0.jpg",
        description: "El bebe jefazo, nada se le escapa",
        facebookId: "",
        role: "BOSS"
    }
]

User
    .create(users)
    .then(allUsersCreated => {
        console.log(`Created ${allUsersCreated.length} users`)
        mongoose.connection.close();
    })
    .catch(err => console.log('Hubo un error,', err))