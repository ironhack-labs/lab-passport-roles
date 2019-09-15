// middleware siempre necesita next
module.exports = fn => (req, res, next) => fn(req, res, next).catch(next)

/* catchErrors((req, res, next) =>{
  return catchErrors.catch(next)
})

module.exports = catchErrors */