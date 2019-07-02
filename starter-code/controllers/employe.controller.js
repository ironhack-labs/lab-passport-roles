const User = require('../models/User')
exports.getDashboardEmployee = (req, res) => {
  res.render('employee/dashboard', {user: req.user})
}

exports.getEmployees = (req, res) => {
  User.find()
    .then(employees => {
      res.render('employee/list', {employees}) 
    })
    .catch(err =>  {
      res.render('employee/list', err)
    })
}