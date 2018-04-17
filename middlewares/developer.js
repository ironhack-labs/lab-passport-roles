const developer = (redirectTo) => (req,res,next) => {
    if(req.user && req.user.developer){
        console.log("WELCOME MY LORD DEVELOPER");
        next();
    }else{
        console.log("You are a looser, not a developer!");
        res.redirect(redirectTo)
    }
}

module.exports = developer;