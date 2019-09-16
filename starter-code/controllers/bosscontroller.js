const User = require('../models/User')

exports.createUserForm = (req, res, next) => {
  res.render('auth/createStaff')
}

exports.createUser = async (req, res, next) => {
  const newUser = await User.register({
    ...req.body
  }, req.body.password)
  console.log(newUser)
  res.redirect('/profile')
}

exports.deleteUser = async (req, res) => {
  const {
    id
  } = req.params
  await User.findByIdAndDelete(id)
  res.redirect('/profile')

}
