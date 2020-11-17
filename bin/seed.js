const mongoose = require('mongoose');
const User = require('../models/user.model');

const dbName = 'lab-passport-roles'
mongoose.connect(`mongodb://localhost/${dbName}`)

//Test Seeding
const users = [

    {
        username: 'Mulero',
        name: 'Oscar Mulero',
        password: 'Oaks',
        profileImg: 'Img0',
        description: 'DJ',
        facebookId: 'oscar-mulero',
        role: 'Boss',
    },
    {
        username: 'Kaosss',
        name: 'Héctor Oaks',
        password: 'Oaks',
        profileImg: 'Img1',
        description: 'DJ',
        facebookId: 'hector-oaks',
        role: 'Dev',
    },
    {
        username: 'SPFDJ',
        name: 'SPFDJ',
        password: 'spfdj',
        profileImg: 'Img2',
        description: 'DJ',
        facebookId: 'spfdj',
        role: 'TA',
    },
    {
        username: 'VTSS',
        name: 'VTSS',
        password: 'VTSS',
        profileImg: 'Img3',
        description: 'DJ',
        facebookId: 'vtss',
        role: 'Student',
    },
    {
        username: 'SNTS',
        name: 'SNTS',
        password: 'snts',
        profileImg: 'Img4',
        description: 'DJ',
        facebookId: 'snts',
        role: 'Guest',
    },
]


User
    .create(users)
    .then(allUsers => {
        console.log(`Se han creado ${allUsers.length} users`)
        mongoose.connection.close()
    })
    .catch(err => console.log('Hubo un error,', err))




