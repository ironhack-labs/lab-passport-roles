'use strict';

module.exports = {
    checkRoles: function(role) {
        return function(req, res, next) {
            if (req.isAuthenticated() && req.user.role === role) {
                return next();
            } else {
                res.redirect('/admin/login');
            }
        };
    }
};
