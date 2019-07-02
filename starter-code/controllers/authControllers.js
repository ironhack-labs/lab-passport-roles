const User = require('../models/User')

exports.getSignup = (req, res) => {
  res.render('auth/signup')
}

exports.postSignup = async (req, res) => {
  const { username, password } = req.body
  await User.register(new User({ username }), password)
  res.redirect('/auth/login')
}

exports.getLogin = (req, res) => {
  res.render('auth/login')
}

exports.postLogin = (req, res) => {
  const { username } = req.body
  User.findOne({ username })
  .then(user => {
    if(user.role === 'BOSS'){
      res.redirect('/boss/bossMenu')
    } else {
      res.redirect('/')
    }
  })
  .catch(err => console.log(err))
}

exports.logout = (req, res) => {
  req.logout()
  res.redirect('/')
}