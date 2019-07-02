const mongoose = require("mongoose")
const User = require("../models/user")

const Users = [{
 username: "Manolo",
 password: "Boss",
 role:'BOSS'
}]

mongoose
   .connect('mongodb://localhost/passport-roles', { useNewUrlParser: true })
   .then(x => {
       console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)

       User.insertMany(Users)

       .then((data) => {
           console.log(data)
           console.log("Chachi")
           mongoose.disconnect()

       }).catch((err) => {
           console.log(err)
       })
   })
   .catch(err => {
       console.error('Error connecting to mongo', err)
   });