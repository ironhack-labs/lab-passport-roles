const mongoose = require('mongoose')
const User = require('../models/User')

mongoose.connect('mongodb://localhost/lab-passport-roles', {useNewUrlParser: true})
.then(async() => {
  await User.register({
    email: 'boss@ironhack.com',
    name: 'Xavier',
    lastname: 'Martinez',
    role: 'BOSS'
  },
  'ironhack'
  )
  mongoose.connection.close()
}
).catch(err => {
  console.log(err)
  mongoose.connection.close()
})