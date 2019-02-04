const mongoose = require('mongoose');
const  User = require('../models/user');

const bcrypt     = require("bcrypt");
const saltRounds = 10;

const dbname = 'roles-project';
mongoose.connect(`mongodb://localhost/${dbname}`);
User.collection.drop();

function passwordCrypt (password){
    const salt  = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    return hash;
}

const users = [ 
    {
        username:"sofia",
        password: passwordCrypt("12345"),
        role: "Boss"
    },
    {
        username:"francisco",
        password: passwordCrypt("123456"),
        role: "Developer"

    },
    {
        username:"pedro",
        password: passwordCrypt("1234567"),
        role: "TA"
    }
]


User.create(users)
.then(users => {
    console.log("Create all users")
    mongoose.connection.close();
})
.catch(error => {
    console.log('Error while create users in db: ', error);
    mongoose.connection.close();
})

