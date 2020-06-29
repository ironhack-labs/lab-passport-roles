
const mongoose = require('mongoose')
mongoose.connect(`mongodb://localhost/passport-roles`)


const User = require('../models/User.model')


const users = [{
    username: 'Germantastico',
    name: 'Germán Alvarez',
    password: 'popino',
    role: 'BOSS'
}, { timestamps: true }]


User
    .create(users)
    .then(allTheUsers => { 
        console.log('Hemos creado al jefe')
        mongoose.connection.close()
    })
    .catch(err => console.log('hubo este erro', err))