require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const dbUrl = process.env.DBURL;

mongoose.Promise = Promise;
mongoose
  .connect( dbUrl, { useMongoClient: true })
  .then(() => {
    console.log("Connected to Mongo!");

    User.collection.drop();

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync("111111", salt);
    
    const boss = new User({
      username: 'marc',
      password: hashPass,
      role: 'Boss'
    });

    boss.save()
      .then((data) => {
        console.log(`${data.role} created.`);

        mongoose.disconnect();
      });
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });