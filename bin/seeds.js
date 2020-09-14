const mongoose = require('mongoose');
const User = require('../models/User.model');

const dbName = 'passport';
mongoose.connect(`mongodb://localhost/${dbName}`, { useNewUrlParser: true, useUnifiedTopology: true })

const user = {
    username: "DavidBoss",
    name: "David",
    password: "123popino",
    profileImg: "undefined",
    description: "The BOSS",
    facebookId: "none",
    role: "BOSS"
}


User.create(user)
    .then(bossCreated => console.log('Se han creado', bossCreated.length, 'BOSS en la BBDD'))
    .catch(err => console.log('ERROR: ', err))