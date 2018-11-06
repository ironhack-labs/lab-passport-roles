app.use((req, res, next) => {
  res.locals.x = 42
  // all the views have a variable x equal to 42

  // if the user is conncted, passport defined before a req.user
  res.locals.isConnected = !!req.user
  // !! converts truthy/falsy to true/false

  res.locals.isBoss = req.user && req.user.role === 'Boss'
  // console.log("DEBUG", req.user);
  // console.log("DEBUG", req.user._id);
  // console.log("DEBUG", req.user.role);


  next() // to go to the next middleware
})