const User = require('../models/User')

exports.createForm = (req, res) =>{
  res.render('auth/create-profile')
}
exports.createUser = async (req, res, next) =>{
  try{
    const {name, lastName, email, role} = req.body
    await User.register({name, lastName, email, role}, req.body.password)
    res.redirect('/account')
  }catch (e){
    console.log(e)
    res.send('El usuario ya existe')
  }
}

