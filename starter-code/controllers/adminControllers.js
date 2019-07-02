const User = require('../models/User')

exports.findUsers = (req, res, next) => {
  User.find()
    .then(users => res.render('ironhack', { users }))
    .catch(err => res.render('ironhack', err))
}

exports.deleteUser = (req, res, next) => {
  const { id } = req.params
  User.findByIdAndRemove(id)
    .then(user => res.redirect('/admin/ironhack'))
    .catch(err => res.send(err))
}
