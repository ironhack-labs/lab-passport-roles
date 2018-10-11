const
  mongoose = require(`mongoose`),
  User     = require(`../models/User`),
  passport = require(`passport`)
;
 mongoose.connect(`mongodb://localhost:27017/security`, {useNewUrlParser: true, useMongoClient: true});
 const
  users = [
    {
      username: `usuario`,
      password: `admin`,
      role: `admin`
    }
  ],
  password = users[0].password,
  {username, role} = users[0]
;
 User
  .register({username, role}, password)
  .then(() => {
    console.log(`${users.length} created`);
    mongoose.connection.close();
  });