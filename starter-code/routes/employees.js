const router = require('express').Router()
const catchErrors = require('../middlewares/catchErros')
const checkRole = require('../middlewares/checkRole')
const Employee = require('../models/Employee')
const {
  /*getEmployees,*/ createEmployee /*, deleteEmployee*/
} = require('../controllers/employees')

// router.get('/employees', catchErrors(getEmployees)) //Envian noticias
// router.get('/create', createNewForm)
router.post('/create', checkRole('BOSS'), catchErrors(createEmployee)) //Llegan las noticias
// router.get('/delete/:id', checkRole('BOSS'), catchErrors(deleteEmployee)) //

module.exports = router
