const mongoose = require("mongoose")
const dbname = 'PASSPORT'

mongoose.connect(`mongodb://localhost/${dbname}`)

const User = require('../models/user.model')


const bcrypt = require("bcrypt")
const bcryptSalt = 10
const salt = bcrypt.genSaltSync(bcryptSalt)


const users = [
    {
        username: 'Pepito',
        name: 'Pepe',
        password: bcrypt.hashSync('popino', salt),
        description: 'El rey de las aulas',
        role: 'BOSS'
    }
]


User.create(users)
.then(all => console.log('------La base de datos se ha creado correctamente ------=>', all))
.catch(err => console.log(err))

// const Movie = require('../models/moviemodel')