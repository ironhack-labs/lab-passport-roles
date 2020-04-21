const mongoose = require("mongoose");
const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const dbName = "passport-roles";
mongoose.connect(`mongodb://localhost/${dbName}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const salt = bcrypt.genSaltSync(bcryptSalt);

const users = [
  {
    username: "Tha Baussa",
    name: "Paquito Tellez",
    password: bcrypt.hashSync("boss", salt),
    profileImg: "../images/descarga.jpeg",
    description: "El que maneja el cotarro",
    facebookId: "FB",
    role: "BOSS",
  },
  {
    username: "Tha Best",
    name: "Fernando Canchas",
    password: bcrypt.hashSync("ta1", salt),
    profileImg: "../images/descarga.jpeg",
    description: "El que se lo curra",
    facebookId: "FB",
    role: "TA",
  },
  {
    username: "Tha Good",
    name: "Juanjo Monjes",
    password: bcrypt.hashSync("ta2", salt),
    profileImg: "../images/descarga.jpeg",
    description: "El que tambien se lo curra",
    facebookId: "FB",
    role: "TA",
  },
  {
    username: "Tha Pringui",
    name: "Hefesto Caldero",
    password: bcrypt.hashSync("dev1", salt),
    profileImg: "../images/descarga.jpeg",
    description: "El que pica codigo",
    facebookId: "FB",
    role: "DEV",
  },
  {
    username: "Tha Smartie",
    name: "Germancito Garbancito",
    password: bcrypt.hashSync("dev2", salt),
    profileImg: "../images/descarga.jpeg",
    description: "El que hace que el otro pique codigo",
    facebookId: "FB",
    role: "DEV",
  },
];

User.create(users)
  .then((allUsers) => {
    console.log(`${allUsers.length} usuarios creados`);
    mongoose.connection.close();
  })
  .catch((err) => console.log(`An error ocurred: ${err}`));
