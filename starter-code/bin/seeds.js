const mongoose = require ("mongoose")

require ("./../configs/db.config")

const usersSeed = require("./seeds/users.seed")

usersSeed().then(() => {
  console.log("Users created successfully")
  process.exit(0)
})
