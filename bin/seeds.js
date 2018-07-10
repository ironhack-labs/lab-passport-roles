require("dotenv").config();

const mongoose = require("mongoose");
const Celebrity = require("../models/User");


const dbName = process.env.DBURL;
mongoose.connect(dbName);
const User = []

