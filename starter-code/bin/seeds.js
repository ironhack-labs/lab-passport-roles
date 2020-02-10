const mongoose = require("mongoose");

function dbConnect(cb) {
  mongoose
    .connect("mongodb://localhost/user", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(x => {
      console.log(
        `Connected to Mongo! Database name: "${x.connections[0].name}"`
      );
      cb();
    })
    .catch(err => {
      console.error("Error connecting to mongo", err);
    });
}

dbConnect(() => {
  const user = require("../models/user");
  const users = [
    {
      username: "Boss",
      password: "Boss",
      role: "Boss"
    },
    {
      username: "Developer",
      password: "Developer",
      role: "Developer"
    },
    {
      username: "TA",
      password: "TA",
      role: "TA"
    },
    {
      username: "Student",
      password: "Student",
      role: "Student"
    }
  ];

  user
    .deleteMany()
    .then(() => {
      return user.create(users);
    })

    .then(() => {
      console.log("succesfully added all the data");
      mongoose.connection.close();
      process.exit(0);
    });
});
