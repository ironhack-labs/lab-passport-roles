const mongoose = require("mongoose");
const User = require("./../models/User");

mongoose
  .connect("mongodb://localhost/passport-roles", { useNewUrlParser: true })
  .then(async () => {
    await User.register(
      {
        email: "boss@ironhack.com",
        firstName: "Joshep",
        lastName: "Jostar",
        role: 'BOSS',
      },
      "hamon"
    );
    console.log("all good");
    mongoose.connection.close();
  })
  .catch(err => {
    console.log(err);
    mongoose.connection.close();
  });
