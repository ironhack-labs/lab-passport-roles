const {Router} = require('express')
const router = Router()
const { getDashboardEmployee, getEmployees } = require('../controllers/employe.controller')

router.get('/dashboard', getDashboardEmployee)
router.get('/employees-list', getEmployees)
module.exports = router