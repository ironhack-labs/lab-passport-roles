const mongoose = require('mongoose')

const User = require('../models/User.model')

const dbtitle = 'passport-roles'
mongoose.connect(`mongodb://localhost/${dbtitle}`)

const user =[

    
    {
        username: "paco",
        name: "paco",
        password: "0000",
        profileImg: "image",
        description: "q mierda es esto",
        facebookId: "33214",
        role: "BOSS" 
        
    },
    
]

User.create(user)
.then(userCreate => console.log("se han creado ", userCreate.length,"usuarios"))
.catch(err => console.log("error",err))