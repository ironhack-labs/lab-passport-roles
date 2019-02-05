const mongoose = require('mongoose');
const User = require('../models/user.js');

 const dbName = 'lab-passport-roles';
mongoose.connect(`mongodb://localhost/${dbName}`);


 const users = [
        {
            username: 'Bruce',
            password: '1234',
            role:'Boss'
        },
        {
            username: 'Joan',
            password: '1234',
            role:'TA'
        }
        
    ];

    User.insertMany(users, (err) => {
        if (err) { throw(err) }
       
        mongoose.connection.close()
    });