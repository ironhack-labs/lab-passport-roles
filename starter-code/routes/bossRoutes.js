const {Router} = require('express')
const router = Router()
const { getDashboard, newEmployee, newEmployeeSignup, findEmployees, deleteOneEmployee } = require('../controllers/admin.controller')

router.get('/dashboard', getDashboard)
router.get('/new-employee', newEmployee)
router.post('/signup', newEmployeeSignup)
router.get('/employee-list', findEmployees)
router.post('/employees/:id/delete', deleteOneEmployee)
module.exports = router