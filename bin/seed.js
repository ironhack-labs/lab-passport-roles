const mongoose = require( "mongoose" );
const User = require( "../models/user-model" );

mongoose.Promise = Promise;
mongoose
  .connect('mongodb://localhost/12-passport-roles', {useMongoClient: true})
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });


const users = [
    {
        name: "Maggie",
        role: "Boss",
        password: maggie
    },
    {
        name: "Lukasz",
        role: "TA",
        password: lucas
    },
    {
        name: "Sami",
        role: "developer",
        password: sami
    }
];

users.forEach(( oneUser ) => {
    return User.create( oneUser );
});