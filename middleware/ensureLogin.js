const ensureLoggedIn = () => {
    return (req, res, next) => {
        if(req.user){
            next();
        }else{
            req.flash('error','You have to login first');
            res.redirect('/');
        }
    }
}

/* const isBoss =  (req, res, next) => {
        if(req.user.isBoss){
            next();
        }else{
            req.flash('error','You are not the boss');
            res.redirect('/');
        }
    } */

const hasRole = (role) => {
    return (req, res, next) => {
        if(req.user.role.includes(role)){
            next();
        }else{
            req.flash('error',`You do not have the role ${role}`);
            res.redirect('/');
        }
    }
}

module.exports = {
    ensureLoggedIn,
    hasRole
}