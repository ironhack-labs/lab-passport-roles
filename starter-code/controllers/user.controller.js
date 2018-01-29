const mongoose = require('mongoose');
const User = require('../models/user.model');

module.exports.index = (req, res, next) => {
    res.redirect(`/user/${req.user._id}/profile`);
}

module.exports.profile = (req, res, next) => {
    res.render("user/profile", req.user);
}

module.exports.edit = (req, res, next) => {
    User.findById(req.params.id)
    .then((user) => {
        res.render('user/edit', user);
    })
    .catch((error) => next(error));

}

module.exports.doEdit = (req, res, next) => {
    
}

module.exports.create = (req, res, next) => {
    
}

module.exports.doCreate = (req, res, next) => {
    
}

module.exports.delete = (req, res, next) => {
    res.send("DELETE");
}