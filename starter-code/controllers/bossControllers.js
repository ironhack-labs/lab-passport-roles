const User = require('../models/User')

exports.getAllEmployees = (req, res) => {
  User.find({ "role": { "$ne": 'BOSS' } })
    .then(users => res.render('boss/allEmployees', { users }))
    .catch(err => console.log(err))
}

exports.addEmployee = async (req, res) => {
  const { username, password, role } = req.body
  await User.register({ username, role }, password)
  res.redirect('/boss/bossMenu')
}

exports.deleteEmployee = async (req, res) => {
  const { id } = req.body
  await User.findByIdAndDelete(id)
  res.redirect('/boss/bossMenu')
}