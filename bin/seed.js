const mongoose = require("mongoose")
const User = require("../models/user.model")

const dbName = "passport-roles"
mongoose.connect(`mongodb://localhost/${dbName}`, { useNewUrlParser: true, useUnifiedTopology: true })


// Remove the previous entries on the database to avoid duplicities
User.collection.drop()

// Create in this place the passwords is a simple way to create users
const bcrypt = require("bcrypt")
const bcryptSalt = 10

const psd1 = "Solid"
const psd2 = "axolot"

const salt = bcrypt.genSaltSync(bcryptSalt)
const hashPass1 = bcrypt.hashSync(psd1, salt)
const hashPass2 = bcrypt.hashSync(psd2, salt)

// Seed the User collection
const users = [
    {
        username: "Snake",
        name: "Ismael",
        password: hashPass1,
        profileImg: "https://upload.wikimedia.org/wikipedia/en/d/d2/MGS2_Solid_Snake.png",
        description: "Soldier",
        facebookId: "SolidSnake",
        role: "BOSS"
    },
    {
        username: "Joy",
        name: "Charlotte",
        password: hashPass2,
        profileImg: "https://upload.wikimedia.org/wikipedia/en/b/b4/The_Boss.png",
        description: "Soldier",
        facebookId: "TheBoss",
        role: "TA"
    },
]


User.create(users)
    .then(allUsers => console.log(`${allUsers.length} have added to ${dbName}`))
    .catch(err => console.log(`Ups, an error: ${err}`))

//  mongoose.connection.close(() => console.log('Mongoose default connection disconnected through app termination')) 