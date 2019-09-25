
const mongoose = require('mongoose');
const Blog = require('../models/Blog');

const dbName = 'project-bloggy';
mongoose.connect(`mongodb://localhost/${dbName}`);



const blogs = [
  {
    "text": "interneEnter text here...",
    "name": "Josue Acevedo",
    "title": "One day at IronHack",
    "picture": "slider-3.jpg",
    "category": "Music"
  },
  {
    "text": "interneEnter text here...",
    "name": "Nancy Doe",
    "title": "Going Shopping",
    "picture": "slider-1.jpg",
    "category": "Software"
  },
  {
    "text": "interneEnter text here...",
    "name": "Juan Garcia",
    "title": "Software Blog",
    "picture": "slider-2.jpg",
    "category": "Software"
  },
  {
    "text": "interneEnter text here...",
    "name": "Jane Smith",
    "title": "Hardware Blog",
    "picture": "beach-1.jpg",
    "category": "Software"
  },
  

];

Blog.collection.drop();

Blog.create(blogs, (err) => {
  if (err) { throw(err) }
  console.log(`Created ${blogs.length} blogs`)
  mongoose.connection.close();
});