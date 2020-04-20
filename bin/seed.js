const mongoose = require("mongoose")
const User = require("../models/User.model")
const bcrypt = require("bcrypt")
const bcryptSalt = 10
const salt = bcrypt.genSaltSync(bcryptSalt)

mongoose.connect('mongodb://localhost/passport-roles', { useNewUrlParser: true })

const users = [
    {
        username: "DarthVader",
        name: "Anakin",
        password: bcrypt.hashSync("IamYourFather", salt),
        profileImg: "../images/darth-vader.jpg",
        description: "Come to the Dark Side",
        facebookId: "https://es-la.facebook.com/people/Mr-Darth-Vader/100009466604313",
        role: "STUDENT"
    },
    {
        username: "Rick-Sanchez",
        name: "Rick",
        password: bcrypt.hashSync("GetSwifty", salt),
        profileImg: "../images/rick-sanchez.png",
        description: "You are a piece of shit and I can prove it Mathematically",
        facebookId: "https://es-es.facebook.com/people/Rick-Sanchez/100011970103160",
        role: "BOSS"
    },
    {
        username: "Robin-Hood",
        name: "Robin",
        password: bcrypt.hashSync("moneyToThePoor99", salt),
        profileImg: "../images/robin-hood.jpg",
        description: "Karl Marx was right",
        facebookId: "https://es-la.facebook.com/people/Robbin-Hood/100011671286390",
        role: "STUDENT"
    },
    {
        username: "TheMask",
        name: "Jim",
        password: bcrypt.hashSync("sssssmoking", salt),
        profileImg: "../images/the-mask.jpeg",
        description: "Let's dance, baby!",
        facebookId: "https://es-la.facebook.com/TheMaskOfficial/",
        role: "TA"
    },
    {
        username: "Bugsbunny_Lord",
        name: "Bugs",
        password: bcrypt.hashSync("ILUVCARROTS", salt),
        profileImg: "../images/bugs-bunny.jpeg",
        description: "Come to the Dark Side",
        facebookId: "https://es-la.facebook.com/bugs.bunny.click.here/",
        role: "TA"
    },
]

User.create(users)
    .then(allUsers => {
        console.log(allUsers.length, " users have been created")
        mongoose.connection.close()
    })
    .catch(error => console.log("An error has occured: ", error))