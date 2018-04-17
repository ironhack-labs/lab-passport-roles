const boss = (redirectTo) => (req,res,next) => {
    if(req.user && req.user.boss){
        console.log("WELCOME MY LORD BOSS");
        next();
    }else{
        console.log("You are a looser, not an boss!");
        res.redirect(redirectTo)
    }
}

module.exports = boss;