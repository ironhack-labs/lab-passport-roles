const mongoose = require('mongoose');
const User = require('../models/User.model');

const dbName = 'passport-roles';
mongoose.connect(`mongodb://localhost/${dbName}`, { useNewUrlParser: true, useUnifiedTopology: true });

const bcrypt = require("bcrypt")
const bcryptSalt = 10
const salt = bcrypt.genSaltSync(bcryptSalt)


const users = [{
        username: "xokoloko",
        name: "Paquito el Chocolatero",
        password: bcrypt.hashSync('xokoloko', salt),
        profileImg: "../images/profile.png",
        description: "Una persona muy humilde y un puto amo",
        facebookId: "www.facebook.com/paquito",
        role: 'BOSS'
    },
    {
        username: "machomen",
        name: "Paquito el Churrero",
        password: bcrypt.hashSync('machomen', salt),
        profileImg: "../images/profile.png",
        description: "Una persona muy humilde y un puto amo",
        facebookId: "www.facebook.com/paquito",
        role: 'DEV'
    },
    {
        username: "machupichu",
        name: "Paquito el mantequillero",
        password: bcrypt.hashSync('machupichu', salt),
        profileImg: "../images/profile.png",
        description: "Una persona muy humilde y un puto amo",
        facebookId: "www.facebook.com/paquito",
        role: 'DEV'
    },
    {
        username: "pixy",
        name: "Paquita la flipiturera",
        password: bcrypt.hashSync('pixy', salt),
        profileImg: "../images/profile.png",
        description: "Una persona muy humilde y un puto amo",
        facebookId: "www.facebook.com/paquito",
        role: 'TA'
    },
    {
        username: "florecilla",
        name: "Paquita la florera",
        password: bcrypt.hashSync('florecilla', salt),
        profileImg: "../images/profile.png",
        description: "Una persona muy humilde y un puto amo",
        facebookId: "www.facebook.com/paquito",
        role: 'TA'
    },
    {
        username: "1",
        name: "Paquita la florera",
        password: bcrypt.hashSync('1', salt),
        profileImg: "../images/profile.png",
        description: "Una persona muy humilde y un puto amo",
        facebookId: "www.facebook.com/paquito",
        role: 'TA'
    }
]

User.create(users)
    .then(allTheUsers => {
        console.log(`${allTheUsers.length} users created!`)
        mongoose.connection.close();
    })
    .catch(err => console.log(`An error ocurred: ${err}`))