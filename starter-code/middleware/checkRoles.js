const checkRoles = (role) => {
        return (req, res, next) => {
            if (req.isLoggedIn() && req.user.role === role) {
                return next();
            } else {
                res.redirect('/')
            }
        }
    }
    
    module.exports = checkRoles; 