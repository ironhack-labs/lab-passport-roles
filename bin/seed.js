const mongoose = require('mongoose');
mongoose.connect(`mongodb://localhost/development`);
const User = require('../models/User.model');


User.create(users)
    .then(theUsers => {
        console.log(`Created ${theUsers.length} Users`)
        mongoose.connection.close()
    })
    .catch(err => console.log('There was an error creating the users', err))






