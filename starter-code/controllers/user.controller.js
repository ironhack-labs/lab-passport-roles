const mongoose = require('mongoose');
const User = require('../models/user.model');

module.exports.index = (req, res, next) => {
    res.render("user/index");
}

module.exports.profile = (req, res, next) => {
    res.render("user/profile");
}

module.exports.edit = (req, res, next) => {
    res.send("EDIT");

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