 
'use strict';

module.exports = allowed => {
  return (req, res, next) => {
    const role = req.user.role;
    if (!allowed.includes(role)) {
      next(new Error('User has no permission to visit that page.'));
      return;
    }
    next();
  };  
};