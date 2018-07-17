const createError = require('http-errors');
const constants = require('../constants');

module.exports.auth = (req, res, next) =>{    
    if (req.isAuthenticated()) {
        next();
    } else{        
        res.status(400).redirect('/sessions/create');
    }
};

module.exports.notAuth = (req, res, next) =>{
    if (req.isAuthenticated()) {
        res.status(200).redirect('/');
    } else{
        next();        
    }
};

module.exports.checkRole = (role) =>{
    return (req, res, next) =>{
        if (req.isAuthenticated() && req.user.role === role) {
            next();
        } else{
            // next(createError(403, `insufficient privilages`));
            res.redirect('/');
        }
    };
};



