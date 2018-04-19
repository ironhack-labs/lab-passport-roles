const express = require('express');
const User = require("../models/user-model");

const router = express.Router();

router.get("/admin/users", (req, res, next) => {
    if(!req.user || req.user.role !== "Boss"){
        next();
        return
    }

    User.find()
        .then((usersFromDb) => {
            res.locals.userList = usersFromDb;
            res.render("admin-views/user-list-page")
        })
        .catch((err) => {
            next(err);
        })
})

router.get('/user/:userId/delete', (req, res, next) => {
    User.findByIdAndRemove(req.params.userId)
    .then(() => {
        res.redirect('/admin/users')
    })
    .catch((err) => {
        next(err)
    })
})

router.get("/admin/add-users", (req,res,next) =>{
    if(!req.user || req.user.role !== "Boss"){
        next();
        return
    }
    res.render("auth-views/signup-form")
})

module.exports = router;