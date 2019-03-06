require("dotenv").config()
const mongoose = require("mongoose")
const User = require("../models/users")

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

mongoose
    .connect(process.env.DB, { useNewUrlParser: true })
    .then(x => {
        console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
    })
    .catch(err => {
        console.error('Error connecting to mongo', err)
    })

.then(() => {

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync("password", salt);

    const newUser = new User({
        username: "GabiLondo",
        password: hashPass,
        role: "Boss"
    });

    newUser.save()
    console.log("Boss creado!")
})

.then(users => {
    //mongoose.connection.close()
})