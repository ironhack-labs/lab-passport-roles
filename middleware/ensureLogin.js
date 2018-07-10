
const ensureLoggedIn = (redirectTo) => {
    return (req, res, next) => {
        if(req.user){
            next();
        }else{
            req.flash('error','You have to login first');
            res.redirect(redirectTo);
        }
    }
}

const ensureLoggedOut = (redirectTo) => {
    return (req, res, next) => {
        if(!req.user){
            next();
        }else{
            req.flash('error','You are logged in, cannot access');
            
            res.redirect(redirectTo);
        }
    }
}

const isAdmin =  (req, res, next) => {
    if(req.user.isAdmin){
        next();
    }else{
        req.flash('error','You are not the admin');
        res.redirect(redirectTo);
    }
}

const hasRole = role => {
    return (req, res, next) => {
        console.log(role)
        if(req.user.role == role){
            next();
        }else{
            req.flash('error',`You do not have the role ${role}`);
            res.redirect("/");
        }
    }
}

module.exports = {
    ensureLoggedIn,
    ensureLoggedOut,
    isAdmin, 
    hasRole
}
