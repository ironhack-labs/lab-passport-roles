const developer = (redirectTo) => (req,res,next) => {
    if(req.user && req.user.developer){
        console.log("WELCOME DEVELOPER");
        next();
    }else{
        console.log("Authentication Failed");
        res.redirect(redirectTo)
    }
}

module.exports = developer;