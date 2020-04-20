const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const bcryptSalt = 10
const salt = bcrypt.genSaltSync(bcryptSalt)

const User = require('../models/User.model')

mongoose
    .connect('mongodb://localhost/passport-roles', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

const constUser = [
    {
        username: 'elBossRules',
        name: 'Jefazo Boss',
        password: bcrypt.hashSync('jefe1', salt),
        role: 'BOSS',
        profileImg: 'https://i.picsum.photos/id/236/200/300.jpg',
        description: 'El jefe es el que manda',
        facebookId: 'Er Faisbu der Jefe'
    },
    {
        username: 'elPrimerDEV',
        name: 'Primer DEV',
        password: bcrypt.hashSync('dev1', salt),
        role: 'DEV',
        profileImg: 'https://i.picsum.photos/id/256/200/300.jpg',
        description: 'El DEV FAVORITO',
        facebookId: 'Er Faisbu der DEV1'
    },
    {
        username: 'elSegunDEV',
        name: 'Segundo DEV',
        password: bcrypt.hashSync('dev2', salt),
        role: 'DEV',
        profileImg: 'https://i.picsum.photos/id/236/200/300.jpg',
        description: 'El DEV menosFAVORITO',
        facebookId: 'Er Faisbu der DEV2'
    },
    {
        username: 'elPrimerTA',
        name: 'Primer TA',
        password: bcrypt.hashSync('ta1', salt),
        role: 'TA',
        profileImg: 'https://i.picsum.photos/id/276/200/300.jpg',
        description: 'El TA FAVORITO',
        facebookId: 'Er Faisbu der TA'
    },
    {
        username: 'elSegundoTA',
        name: 'Segundo TA',
        password: bcrypt.hashSync('ta2', salt),
        role: 'TA',
        profileImg: 'https://i.picsum.photos/id/296/200/300.jpg',
        description: 'El TA MENOS FAVORITO',
        facebookId: 'Er Faisbu der 2TA'
    }
    
]

User.create(constUser)
    .then( () => mongoose.connection.close())
    .catch(err => console.log('error al crear la BD', err))