const User = require('../models/User')

exports.getDashboard = (req, res) => {
  res.render('boss/dashboard',  {user: req.user})
}

exports.newEmployee = (req, res) => {
  res.render('boss/new-employee')
}

exports.newEmployeeSignup = async (req, res) => {
  const { username, password, role } = req.body
  await User.register(new User({ username, role }), password)
  res.redirect('/admin/employee-list')
}

exports.findEmployees = (req, res, next) => {
  User.find()
    .then(employees => {
      res.render('employee/list', {employees}) 
    })
    .catch(err =>  {
      res.render('employee/list', err)
    })
} 

exports.deleteOneEmployee = (req, res, next) => {
  const { id } = req.params
  User.findByIdAndRemove(id)
    .then(deleteOne => {
      console.log(deleteOne);
      res.redirect('/admin/employee-list')
    })
    .catch(err => {
      next()
      console.log(err);
    })
}

