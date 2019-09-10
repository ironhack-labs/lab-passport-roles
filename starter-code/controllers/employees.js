const Employees = require('../models/Employee')

// exports.getEmployees = async (req, res, next) => {
//   const news = await User.find()
//   let user = null
//   if (req.user) {
//     user = req.user.role === 'BOSS'
//   }
//   console.log(user)
//   res.render('employees', { news, user })
// }

// exports.createEmployee = async (req, res, next) => {
//   const { userName, body } = req.body //Spread oerator vulnerable a hackeo
//   const { _id } = req.user

//   await New.create({ userName, body /*, author: _id*/ })

//   res.redirect('/employees')
// }

// exports.createNewForm = (req, res, next) => {
//   res.render('news/create-new')
// }

// exports.deleteEmployee = async (req, res, next) => {
//   const { id } = req.params
//   await New.findByIdAndDelete(id)

//   res.redirect('/employees')
// }

exports.createEmployee = async (req, res) => {
  const { userName, role } = req.body

  //Si no asigno la promesa a una variable solamente se hace una pausa hasta cumplir la promesa
  await Employees.create({ userName, role })
  //Una vez pasada cierta cantidad de tiempo en la creacion del libro hago render del catálogo
  res.redirect('/employees') //redirect recibe una ruta
}
