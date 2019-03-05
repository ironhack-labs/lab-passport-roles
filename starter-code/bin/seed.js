require("dotenv").config()
const mongoose = require("mongoose")
const User = require("../models/User")

const bcrypt      = require("bcrypt");
const bcryptSalt  = 10;

const salt = bcrypt.genSaltSync(bcryptSalt);
const password = "jefesupremo"
const hashPass = bcrypt.hashSync(password, salt);


mongoose
    .connect(process.env.DB, {useNewUrlParser: true})
    .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
    })
    .catch(err => {
    console.error('Error connecting to mongo', err)
    })
    
    .then(() => {
        return User.create(
            {
                username:"General Manager",
                password: hashPass,
                bio: "Supreme boss of the universe. Being rich since newborn.",
                picURL: "../images/boss.jpg",
                role: "Boss"
            }
        )
    })

    .then((users) => {
        mongoose.connection.close()
    })