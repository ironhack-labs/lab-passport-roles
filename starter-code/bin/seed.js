// aqui va la ficha del boss metida a mano

const mongoose = require("mongoose");
const User = require("../models/user.models");

const dbName = "Ironhackers-app-webmad1019";
mongoose.connect(`mongodb://localhost/${dbName}`);

const user = [
  {
    name: "Juanita Banana",
    password: "1234",
    role: "BOSS"
  }
];
const salt = bcrypt.geSaltSync(bcryptsalt);
const hashPass = bcrypt.hashSync(user.password, salt);

User.create({
  username: URLSearchParams.username,
  password: hashPass,
  role: user.role
})
  .then(newUser => console.log("Boss created"))
  .then(() => mongoose.connection.close())
  .catch(err => console.log("error al pasar el new user", err));

// User.create(user, err => {
//   if (err) {
//     throw err;
//   }
//   console.log(user);
//   mongoose.connection.close();
// });
