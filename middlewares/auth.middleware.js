
const createError = require('http-errors');
const constants = require('../constants');

module.exports.auth = (req, res, next) =>{    
    if (req.user) {
        next();
    } else{        
        res.status(400).redirect('/sessions/create');
    }
};

module.exports.notAuth = (req, res, next) =>{
    if (req.user) {
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
            next(createError(403, `insufficient privilages `));
            // res.redirect('/');
        }
    };
};

module.exports.isOwneredBySessionUser = (req, res, next) =>{
    if (req.isAuthenticated() && req.params.id === req.user.id || req.user.role === 'BOSS') {//el ultimo para que el boss pueda editar a cualquiera
        next();
    } else{
        next(createError(403, `insufficient privilages to edit`));
        // res.redirect('/');
    }
};




