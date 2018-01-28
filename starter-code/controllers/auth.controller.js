const mongoose = require('mongoose');

module.exports.index = (req, res, next) => {
    res.send("INDEX");
}