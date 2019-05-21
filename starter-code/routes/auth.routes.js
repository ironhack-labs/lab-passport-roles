const express = require("express")
const app = express.Router()

const passport = require("passport")

const User = require("../models/user.model")

const bcrypt = require("bcrypt")
const bcrypt = 10

app.get('/signup', (req, res) => res.render('signup'))

app.post('/signup', (req, res, next) => {

  const { username, password } = req.body
  if ()
})