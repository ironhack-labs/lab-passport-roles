module.exports = {
    
    checkBoss: checkBoss = (role) => {
        return (req, res, next) => {
            if(req.isAuthenticated() && req.user.role === role){
                return next()
            }else {
                res.redirect('/')
            }
        }
    },
    checkEmployees: checkEmployees = (role1, role2) => {
        return (req, res, next) => {
            if(req.isAuthenticated() && req.user.role === role1){
                return next()
            }if(req.isAuthenticated() && req.user.role === role2){
                return next()
            }else{
                res.redirect('/')
            }
        }
    },
    // checkDev: checkDev = checkRoles('DEV'),
    // checkTa: checkTa = checkRoles('TA'),
    // checkStudent: checkStudent = checkRoles('STUDENT')
}