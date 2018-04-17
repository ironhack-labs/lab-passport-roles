const isBoss = (redirectTo) => (req,res,next) => {
    console.log(req.user.role)
    if(req.user && req.user.roles=='Boss'){
        console.log("WELCOME MY BOSS");
        next();
    }else{
        console.log("You are a simple employee, not a damm boss!");
        res.redirect(redirectTo)
    }
}

module.exports = isBoss;