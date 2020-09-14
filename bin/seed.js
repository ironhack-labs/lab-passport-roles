const mongoose = require('mongoose');

const User = require('../models/user.model')

const bcrypt = require("bcrypt")
const bcryptSalt = 10

const dbName = 'rolesPassport';
mongoose.connect(`mongodb://localhost/${dbName}`, { useNewUrlParser: true, useUnifiedTopology: true })

const boss = [{
    username : "Juan",
    name: "Juan",
    password: "Pestana",
    profileImg: undefined,
    description: "Pues es el jefe y parece majete",
    facebookId: undefined,
    role: 'BOSS'

}]



User.create(boss)
.then(User => console.log('se han creado', User.length, 'nuevos en la bbdd'))
.catch(err => console.log('ERROR: ', err))