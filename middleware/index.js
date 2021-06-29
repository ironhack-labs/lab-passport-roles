module.exports = {
    checkLoggedUser: (req, res, next) => {
        if (req.session.currentUser) {
            next
        } else {
            res.render('auth/sign-in'), { errorMessage: 'Inicia sesion' }
        }
    },
    checkRoles: (...roles) => (req, res, next) => {
        if (roles.includes(req.session.currentUser.role)) {
            next()
        } else {
            res.render('auth/login-page', { errorMessage: 'Área restringida' })
        }
    }
}