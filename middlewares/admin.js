const admin = (redirectTo) => (req,res,next) => {
    if(req.user && req.user.admin){
        console.log(`WELCOME ${req.user.username} ADMIN`);
        next();
    }else{
        console.log("You are a looser, not an admin!");
        res.redirect(redirectTo)
    }
}

module.exports = admin;