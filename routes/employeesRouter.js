const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const Employee = require('../models/employee');

router.get('/', (req, res, next) => {
    Employee.find({role: {$ne: 'Boss'}})
    .then(employees => {
        res.render('employees/list', {employees});
    })
    .catch(err => next())
})

router.get('/create', (req, res, next) => {
    res.render('employees/createForm');
})

router.post('/create', (req, res, next) => {
    const {username, password, role} = req.body;

    var salt = bcrypt.genSaltSync(10);
    var hashPass = bcrypt.hashSync(password, salt);

    const newEmployee = new Employee({
        username,
        password: hashPass,
        role
    })

    newEmployee.save()
    .then(() => {
        res.redirect('/employees');    
    })
    .catch(err => next())
})

router.get('/delete/:id', (req, res, next) => {
    Employee.findByIdAndRemove(req.params.id)
    .then(() => {
        res.redirect('/employees');    
    })
    .catch(err => {
        console.log(err);
        res.send('Error deleting user');
    });
})

router.get('/edit/:id', (req, res, next) => {
    Employee.findById(req.params.id)
    .then(employee => {
        res.render('employees/editForm', {employee});
    })
    .catch(err => {
        console.log(err);
        res.send('Error editing user');
    });
})

router.post('/edit/:id', (req, res, next) => {
    const {username, newPassword, role} = req.body;

    var salt = bcrypt.genSaltSync(10);
    var password = bcrypt.hashSync(newPassword, salt);

    Employee.findByIdAndUpdate(req.params.id, {username, password, role})
    .then(employee => {
        res.redirect('/employees');
    })
    .catch(err => {
        console.log(err);
        res.send('Error editing user');
    });
})

module.exports = router