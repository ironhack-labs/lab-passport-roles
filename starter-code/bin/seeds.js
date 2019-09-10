const User = require('../models/User')
const mongoose = require('mongoose')

const userSchema = [{
  name: 'Emiliano',
  lastname: 'Popoca',
  role: 'BOSS',
  email: 'emilianopb92@gmail.com',
  password:'123'
}]

mongoose
  .connect('mongodb://localhost/lab', {
    useNewUrlParser: true
  })
  .then(async () => {
    const userList = await User.create(userSchema);
    console.log(`${userList.length} users created.`)
    mongoose.connection.close();
  })
  .catch((err) => {
    console.log(err);
  });