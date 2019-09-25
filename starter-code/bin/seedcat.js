
const mongoose = require('mongoose');
const Category = require('../models/Category');

const dbName = 'project-bloggy';
mongoose.connect(`mongodb://localhost/${dbName}`);



const categories = [
  {
    name : "TOP CATEGORIES",
  },
  {
    name : "IronHack",
  },
  {
    name : "Software",
  },
   {
    name : "Hardware",
  },

];

Category.collection.drop();

Category.create(categories, (err) => {
  if (err) { throw(err) }
  console.log(`Created ${categories.length} categories`)
  mongoose.connection.close();
});