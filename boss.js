const User = require('./models/User.model')
const mongoose = require('mongoose')

mongoose
  .connect('mongodb://localhost/passport-roles', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(x => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch(err => console.error('Error connecting to mongo', err));



const generalManager ={
    username:'generalManager',
    name:'Henrique',
    password:'123456',
    acesssLevel:'BOSS'
}

const newUser = new User(generalManager)
newUser.save()