const mongoose = require("mongoose")
const Users = require ("./../../models/Users.model")
const bcrypt = require ("bcrypt")


// Encrypt the boss' password
const bossPassword = "superboss"
const saltRounds = 12;
const salt = bcrypt.genSaltSync(saltRounds);
const encryptedBossPassword = bcrypt.hashSync(bossPassword, salt);

const usersSeed = async () => {
  await Users.deleteMany()
  await Users.create({
    username: 'boss',
    password: encryptedBossPassword,
    role: "BOSS"
  })
}

module.exports = usersSeed
