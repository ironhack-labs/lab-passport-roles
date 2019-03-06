const mongoose = require("mongoose")
const User = require('../models/User')

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const dbtitle = 'passport1'
mongoose.connect(`mongodb://localhost/${dbtitle}`, {
    useNewUrlParser: true
})


const usersArray = [{
        username: "Sonia",
        password: encryptPass("sonia12345"),
        role: "TA"
    },
    {
        username: "German",
        password: encryptPass("german12345"),
        role: "BOSS"
    },
    {
        username: "Isa",
        password: encryptPass("isa12345"),
        role: "DEVELOPER"
    }
]

function encryptPass(pass) {
    const salt  = bcrypt.genSaltSync(bcryptSalt);
    let newPass = bcrypt.hashSync(pass, salt);

    return newPass;
}

// Call the Celebrity model's create method with the array as argument
const users = usersArray.map(user => {
    const newUser = new User(user)
    return newUser.save()
        .then(User => {
            return console.log(User.username)
        })
        .catch(error => {
            throw new Error(`Impossible to add the user. ${error}`)
        })
})