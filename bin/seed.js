const mongoose = require('mongoose');
const bcrypt = require("bcrypt")
const bcryptSalt = 10
const salt = bcrypt.genSaltSync(bcryptSalt)

const User = require('../models/User.model');
//no volver a cometer error de pasar otro nombre que en App.js
mongoose
.connect('mongodb://localhost/passport-roles', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

      
User.collection.drop();

const users = [
    {
        username: "The boss",
        name: "Eljefe",
        password: bcrypt.hashSync('theboss1', salt),
        profileImg: "https://picsum.photos/id/236/200/300",
        description: "Iam the dev",
        facebookId: "thebossonface",
        role: "BOSS"
    },
    {
        username: "The dev1",
        name: "Eldev",
        password: bcrypt.hashSync('thedev1', salt),
        profileImg: "https://picsum.photos/id/237/200/300",
        description: "Iam the dev1",
        facebookId: "thedev1onface",
        role: "DEV"
    },
    {
        username: "The dev2",
        name: "Eldev2",
        password: bcrypt.hashSync('thedev2', salt),
        profileImg: "https://picsum.photos/id/240/200/300",
        description: "Iam the dev2",
        facebookId: "thedev2onface",
        role: "DEV"
    },
    {
        username: "The TA1",
        name: "Elta1 ",
        password: bcrypt.hashSync('theta1', salt),
        profileImg: "https://picsum.photos/id/230/200/300",
        description: "Iam the ta1",
        facebookId: "theta1onface",
        role: "TA"
    },
    {
        username: "The TA2",
        name: "Elta2 ",
        password: bcrypt.hashSync('theta2', salt),
        profileImg: "https://picsum.photos/id/229/200/300",
        description: "Iam the ta2",
        facebookId: "theta2onface",
        role: "TA"
    },
]


User.create(users)
 
    .then((data) => mongoose.connection.close())
    .catch(err => console.log(err))
