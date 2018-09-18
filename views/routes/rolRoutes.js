const express        = require("express");
const router         = express.Router();
// Rol model
const Rol           = require("../models/rol");
//const bcrypt         = require("bcrypt");
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");






const rolSchema = mongoose.Schema({
  /// ...
  user: String,
  role: {
    type: String,
    enum : ['Boss', 'Developer', 'TA']
  },
});