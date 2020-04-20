const mongoose = require('mongoose')
const User = require('../models/User.model')
const bcrypt = require("bcrypt")
const bcryptSalt = 10
const salt = bcrypt.genSaltSync(bcryptSalt)

const dbName = 'passport-roles'
mongoose.connect(`mongodb://localhost/${dbName}`, { useNewUrlParser: true, useUnifiedTopology: true })

const users = [
      {
            username: 'boss1',
            name: 'Boss #1',
            password: bcrypt.hashSync('1', salt),
            profileImg: 'https://cdn.iconscout.com/icon/free/png-256/account-profile-avatar-man-circle-round-user-30452.png',
            description: 'It is a BOSS role user',
            facebookId: 'String',
            role: 'BOSS'
      },
      {
            username: 'dev1',
            name: 'Dev #1',
            password: bcrypt.hashSync('1', salt),
            profileImg: 'https://cdn.iconscout.com/icon/free/png-256/account-profile-avatar-man-circle-round-user-30452.png',
            description: 'It is a DEV role user',
            facebookId: 'String',
            role: 'DEV'
      },
      {
            username: 'dev2',
            name: 'Dev #2',
            password: bcrypt.hashSync('2', salt),
            profileImg: 'https://cdn.iconscout.com/icon/free/png-256/account-profile-avatar-man-circle-round-user-30452.png',
            description: 'It is a DEV role user',
            facebookId: 'String',
            role: 'DEV'
      },
      {
            username: 'ta1',
            name: `Teacher's Asistant #1`,
            password: bcrypt.hashSync('1', salt),
            profileImg: 'https://cdn.iconscout.com/icon/free/png-256/account-profile-avatar-man-circle-round-user-30452.png',
            description: 'It is a TA role user',
            facebookId: 'String',
            role: 'TA'
      },
      {
            username: 'ta2',
            name: `Teacher's Asistant #2`,
            password: bcrypt.hashSync('2', salt),
            profileImg: 'https://cdn.iconscout.com/icon/free/png-256/account-profile-avatar-man-circle-round-user-30452.png',
            description: 'It is a TA role user',
            facebookId: 'String',
            role: 'TA'
      },
      {
            username: 'student1',
            name: `Student #1`,
            password: bcrypt.hashSync('1', salt),
            profileImg: 'https://cdn.iconscout.com/icon/free/png-256/account-profile-avatar-man-circle-round-user-30452.png',
            description: 'It is a STUDENT role user',
            facebookId: 'String',
            role: 'STUDENT'
      }
]

User.create(users)
      .then(theUsers => {
            console.log(`Next users were created: ${theUsers}`)
            mongoose.connection.close()
      })
      .catch(error => next(error))
