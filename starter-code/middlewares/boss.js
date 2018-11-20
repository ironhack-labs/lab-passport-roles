const boss = (redirectTo) => (req,res,next) => {
    if(req.user && req.user.boss){
        console.log("WELCOME BOSS");
        next();
    }else{
        console.log("credentials required!");
        res.redirect(redirectTo)
    }
}

module.exports = boss;