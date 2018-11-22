require("dotenv").config();

const mongoose = require("mongoose");
const User = require("../models/Users");

mongoose.connect(
  process.env.DBURL,
  { useNewUrlParser: true }
);

const Boss = {
  username: "boss",
  password: "$2b$10$cCx4E3Rv8UYVMopM4b5pwexdNumWTBNkE/wi.XdtmeXIJs0v6ur1e", //hola
  role: "Boss"
};

User.create(Boss)
  .then(() => {console.log("Boss created")
mongoose.disconnect()})
  .catch(e => console.log("error", e));
