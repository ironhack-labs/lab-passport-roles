const mongoose = require('mongoose');
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10

module.exports.index = (req, res, next) => {
    res.redirect(`/user/${req.params.id}/profile`);
}

module.exports.profile = (req, res, next) => {
    User.findById(req.params.id)
        .then(user => {
            if(user != null) {
                res.render("user/profile", { 
                    user: user
                    //loggedUser: req.user
                });
            }
            else {
                res.render("user/profile", { 
                    user: 'undefined'
                    //loggedUser: req.user
                });
            }

        })
    
}

module.exports.edit = (req, res, next) => {
    User.findById(req.params.id)
    .then((user) => {
        res.render('user/edit', { user: user });
    })
    .catch((error) => next(error));

}

module.exports.doEdit = (req, res, next) => {
    User.findOne({username: req.body.username})
        .then(user => {
            if(user != null) {
                // hash password
                bcrypt.genSalt(SALT_WORK_FACTOR)
                .then(salt => {
                    bcrypt.hash(req.body.password, salt)
                        .then(hash => {
                            updatedPassword = hash;
                            update = {
                                username: req.body.username,
                                password: updatedPassword,
                                role: req.user.role
                            };
                            User.findByIdAndUpdate(req.user.id, update)
                                .then(res.redirect(`/user/${req.user.id}/profile`))
                                .catch((error) => next(error));
                            next();
                        })
                })
                .catch(error => next(error));
            }
            else {
                res.send("User to edit not found");
            }
        })
        .catch(error => next(error))
}

module.exports.delete = (req, res, next) => {
    User.findByIdAndRemove(req.params.id)
    .then(res.redirect('/'))
    .catch((error) => next(error));
}