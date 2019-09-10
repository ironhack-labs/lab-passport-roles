module.exports = {
    catchErrors: fn => (req, res, next) => fn(req, res, next).catch(next),
    checkRole: roles => (req, res, next) => {
        if (!Array.isArray(roles)) {
            roles = [roles];
        }
        if (req.isAuthenticated() && roles.includes(req.user.role)) {
            next();
        } else {
            res.redirect('/login');
        }
    }
};