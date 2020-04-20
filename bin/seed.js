const mongoose = require('mongoose')
const User = require('../models/User.model')
const bcrypt = require('bcrypt')
const salt = 10


const dbName = 'User-roles'
mongoose.connect(`mongodb://localhost/${dbName}`, { useNewUrlParser: true, useUnifiedTopology: true });


const users = [
    {
        username: "Arnold",
        name: "Juan José",
        password: bcrypt.hashSync('arnold', salt),
        role: 'BOSS'
    },
    {
        username: "Pepe",
        name: "Pepón",
        password: bcrypt.hashSync('pepe', salt),
        role: 'DEV'
    },
    {
        username: "PacoTA",
        name: "Paco Paco",
        password: bcrypt.hashSync('pacopaco', salt),
        role: 'TA'
    },
    {
        username: "misterseñor",
        name: "Tomas",
        password: bcrypt.hashSync('mister', salt),
        role: 'STUDENT'
    },
    {
        username: "Hal",
        name: "Gon",
        password: bcrypt.hashSync('9000', salt),
        role: 'GUEST'
    },
]


User.create(users)
    .then(allUsers => {
        console.log(`${allUsers.length} users created on Database`)
        mongoose.connection.close()
    })