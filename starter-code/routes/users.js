const router = require('express').Router()
const Developer = require('../models/Developer')
const Teacher = require('../models/Teacher')

router.get('/new', (req, res, next) => {
    Teacher.find()
    .then(teacher => {
        res.render('')
    })
})