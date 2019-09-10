const User = require('../models/User')
const passport = require('passport')


exports.getUsers = async (req, res) => {
  const news = await User.find() //.populate('author')
  let user = null
  if (req.user) {
    user = req.user.role === 'BOSS'
  }
  res.render('users/users', {
    email,
    name,
    lastname,
    role,
  })
}
exports.createNew = async (req, res) => {
      const {
        email,
        name,
        lastname,
        role,
        = req.body
        const {
          _id
        } = req.user

        await New.create({
          email,
          name,
          lastname,
          role,
          author: _id
        })
        res.redirect('/users')
      }

      exports.createNewForm = (req, res) => {
        res.render('users/create-new')
      }


      exports.deleteNew = async (req, res) => {
        const {
          id
        } = req.params
        await User.findByIdAndDelete(id)
        res.redirect('/users')
      }