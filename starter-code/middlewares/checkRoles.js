module.exports = role => {
    return (req, res, next) => {
        console.log('no pasa')
        if (req.user && req.user.role === role) {
            next()
        } else {
            res.redirect('/auth/login')
        }
    }
}