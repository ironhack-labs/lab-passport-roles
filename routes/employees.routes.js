const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('employees')
})

router.get('/new-employee', (req, res, next) => {
    res.render('new-employee')
})

router.get('/delete-employee', (req, res, next) => {

    const employeeId = req.query.employee_id

    User
        .findByIdAndDelete(employeeId)
        .then(() => res.redirect('/employees'))
        .catch(err => next(err))
})

module.exports = router