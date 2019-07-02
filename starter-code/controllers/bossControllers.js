const Admin = require('../models/Admin')
const Teacher = require('../models/Teacher')

exports.getTeachers = (req, res) => {
  res.render('boss/team')
}
exports.postTeachers = async (req, res) => {
  const {
    username,
    role
  } = req.body
  await Teacher.find({
    username.name
  })
}