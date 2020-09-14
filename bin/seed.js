const mongoose = require("mongoose");
const dbName = 'rol'
const Boss = require("../models/user.model");
mongoose.connect(`mongodb://localhost/${dbName}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const bcrypt = require("bcrypt")
const bcryptSalt = 10
const password = "diveloper"
const salt = bcrypt.genSaltSync(bcryptSalt)
const hashPass = bcrypt.hashSync(password, salt)
const boss = [
    {
        username: "Admin",
        name: "BOSS",
        password: hashPass,
        profileImg: undefined,
        description: "El Gerente",
        facebookId: undefined,
        role: 'BOSS'
    },
]
Boss.create(boss)
    .then(() => console.log("Gerente creado"))
    .catch(err => console.log('Error: ', err))
