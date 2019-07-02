const { Router } = require('express')
const router = Router()
const { addEmployee, getAllEmployees, deleteEmployee } = require('../controllers/bossControllers')

router.get('/bossMenu', (req, res) => {
  res.render('boss/bossMenu')
})

router.get('/addEmployee', (req, res) => {
  res.render('boss/addEmployee')
})
router.post('/addEmployee', addEmployee)

router.get('/allEmployees', getAllEmployees)

router.post('/deleteEmployee', deleteEmployee)

module.exports = router