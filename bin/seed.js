const mongoose = require("mongoose");
const User = require("../models/user.model");

const dbName = "school-members";
mongoose.connect(`mongodb://localhost/${dbName}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const password = "TheBossIsDepressed";
const salt = bcrypt.genSaltSync(bcryptSalt);
const hashPass = bcrypt.hashSync(password, salt);

User.collection.drop();

const user = [
  {
    username: "El-Jefe",
    name: "Hugo",
    password: hashPass,
    profileImg: "Foto",
    description: "descripción",
    facebookId: "eljjefefacebook",
    role: "boss",
  },
];

User.create(user)
  .then((userMade) => console.log("creado", userMade.length, "user"))
  .catch((err) => console.log("ERROR: ", err));
