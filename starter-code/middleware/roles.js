const passport = require("passport");

const roles = {
    isAuth : function () {
        if (req.isAuthenticated()) return next();
        return res.redirect("/auth/login");
    },
}

module.export = roles