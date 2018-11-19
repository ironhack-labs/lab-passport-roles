const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const User = require('../models/User');

const users = [
    {
        username: 'Boss',
        password: 'cont1',
        role: 'Boss'
    },
    {
        username: 'TA',
        password: 'cont2',
        role: 'TA'
    },
    {
        username: 'Developer',
        password: 'cont3',
        role: 'Developer'
    }
]




users.forEach(function(user){
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(user.password, salt);
    user.password = hashPass;
})

const dbName = 'passport-roles';

mongoose.connect(`mongodb://localhost/${dbName}`)
.then(()=>{

    User.create(users, (err)=>{
        if(err){throw(err)}
        console.log(`Created ${users.length} users`);
        mongoose.connection.close();
    })
    
})