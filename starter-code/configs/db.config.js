const mongoose = require("mongoose");
const DB_NAME = "lab-passport-roles";
const MONGO_URI = `mongodb://localhost/${DB_NAME}`;

// Mongoose configuration
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log(`Connected to ${DB_NAME} database.`);
  })
  .catch(error => {
    console.error(`Database connection error: ${error}`);
  });
