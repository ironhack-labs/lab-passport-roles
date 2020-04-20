const mongoose = require('mongoose')
const User = require('./../models/User.model')
const Course = require('./../models/Course.model')

const bcrypt = require('bcrypt')
const bcryptSalt = 10

const salt = bcrypt.genSaltSync(bcryptSalt)

const dbTitle = 'passport-roles'
mongoose.connect(`mongodb://localhost/${dbTitle}`)

const users = [
  {
    username: "bossbaby",
    name: 'Pepito Piscinas',
    password: bcrypt.hashSync('123', salt),
    role: 'BOSS',
  },
  {
    username: "yquecual",
    name: 'Fulano de Tal',
    password: bcrypt.hashSync('123', salt),
    role: 'DEV',
  },
  {
    username: "pitufina",
    name: 'Mengana Zutánez',
    password: bcrypt.hashSync('123', salt),
    role: 'DEV',
  },
  {
    username: "profeguiri1",
    name: 'John Doe',
    password: bcrypt.hashSync('123', salt),
    role: 'TA',
  },
  {
    username: "profeguiri2",
    name: 'Jane Doe',
    password: bcrypt.hashSync('123', salt),
    role: 'TA',
  },
  {
    username: "homer",
    name: 'Guy Incognito',
    password: bcrypt.hashSync('123', salt),
    role: 'STUDENT',
  },
  {
    username: "shmeckel",
    name: 'Joe Schmoe',
    password: bcrypt.hashSync('123', salt),
    role: 'STUDENT',
  },
  {
    username: "innocentguest",
    name: 'NSA Agent',
    password: bcrypt.hashSync('123', salt),
    role: 'GUEST',
  },
  {
    username: "guest2",
    name: 'Assigned Cop at Birth',
    password: bcrypt.hashSync('123', salt),
    role: 'GUEST',
  },
]

User.create(users)
  .then((users) => {
    console.log(`${users.length} user entries created!`)
    mongoose.connection.close()
  })
  .catch((err) => {
    console.log(`An error occurred upon seeding the database: ${err}`)
  })
