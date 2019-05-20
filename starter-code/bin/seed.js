const mongoose = require("mongoose");
const User = require("../models/User.model");

const dbName = "RoleCompany";
mongoose.connect(`mongodb://localhost/${dbName}`);

const user = [
  {
    username: "Pepe",
    password: "mimamamemima",
    role:"Boss"
  },

];

User.create(user)
  .then(userCreated => {
    console.log(`Creados ${userCreated.length} personas`);
    mongoose.connection.close();
  })
  .catch(err => console.log(`Hubo un error: ${err}`));
