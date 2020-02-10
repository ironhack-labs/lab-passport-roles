require('dotenv').config();
const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const password = "123"


const salt = bcrypt.genSaltSync(bcryptSalt);
const hash = bcrypt.hashSync(password, salt);


const user =[{
  username: "Bruce",
  password: hash,
  roles: "Boss"
}
]


function dbConnect(cb){
mongoose
.connect("mongodb://localhost/employees", { useNewUrlParser: true, useUnifiedTopology: true })
.then(x => {
  console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);  
cb()
})
.catch(err => {
  console.error("Error connecting to mongo", err);
});
}


dbConnect(()=>{
User.deleteMany()
.then(() => {
  return User.create(user);
})
.then(() => {
  console.log("succesfully added all the data");
  mongoose.connection.close();
  process.exit(0);
});
});