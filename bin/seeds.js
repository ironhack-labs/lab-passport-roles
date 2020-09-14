const mongoose = require("mongoose");
const dbName="usersAndCourses"

const Boss = require("../models/user.model");

mongoose.connect(`mongodb://localhost/${dbName}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const bcrypt = require("bcrypt")
const bcryptSalt = 10
const password= "popino"
const salt = bcrypt.genSaltSync(bcryptSalt)
const hashPass = bcrypt.hashSync(password, salt)

const boss=[
    {
        username: "BOSS",
        name: "BOSS",
        password: hashPass,
        profileImg: undefined,
        description: "El Jefazo",
        facebookId: undefined,
        role:'BOSS'
      },

]

Boss.create(boss)
.then(() => console.log("Jefe creado"))
.catch(err=>console.log('Error: ', err))