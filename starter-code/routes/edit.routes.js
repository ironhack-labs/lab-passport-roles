const express = require("express");
const router = express.Router();
const User = require('../models/user.model')


const checkRole = role => (req, res, next) => req.user && req.user.role === role ? next() : res.render("index", {
    //     roleErrorMessage: `you have to be a ${role} to enter this area` // no me sale los mensajes de error
})

// BOSS EDIT
router.get('/admin-edit', checkRole('BOSS'), (req, res) => {
    User.find()
    .then(allUsers => res.render('boss-edit', {
        user: allUsers
    }))
    .catch(err => console.log("Error finding all boss users", err))
});

router.get('/delete/:id', (req, res) => {
    User.findByIdAndDelete(req.params.id)
    .then(oneUser => res.redirect('admin-edit', {
        deleteUser: oneUser
    }))
    .catch(err => console.log("Error deleting users: ", err))
});

router.get("/admin-edit-user/:id", (req, res) => {
    User.findById(req.params.id)
    .then(userEdit => res.render('admin-edit-user', {
        edit: userEdit
    }))
    .catch(err => console.log('error editing users', err))
});
router.post("/admin-edit-user/:id", (req, res) => {
    const {
        username,
        role
    } = req.body;
    User.findOneAndUpdate(req.params.id, {
        username,
        role
    })
    .then(res.redirect("/private"))
    .catch(err => console.log("error editing", err));
    
});

// how to I find all users but also req.user?
router.get('/edit', checkRole('TA'), (req, res) => {
    User.find()
        .then(allUsers => res.render('user-edit', {
            user: allUsers
        }))

        .catch(err => console.log("Error finding all users ", err))
}); //does not show req.user

router.get('/edit', checkRole('DEVELOPER'), (req, res) => res.render('user-edit', {
    user: req.user
}))
module.exports = router