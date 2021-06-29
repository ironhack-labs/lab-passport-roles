const router = require("express").Router()

const User = require('../models/user.model')


// Student list
router.get('/students', (req, res) => {

    User
        .find()
        .select('username')
        .then(user => res.render("students/students-list", { user }))
        .catch(err => console.log(err))

})
router.get('students/:id'), (req, res) => {
    const { user_id } = req.params
    // console.log('El id es ', id)
    User
        .findById(user_id)
        .then(book => res.render('students/students-details', { user }))
        .catch(err => console.log(err))
}
module.exports = router