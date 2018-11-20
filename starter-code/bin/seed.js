const mongoose = require('mongoose');
const Course = require('../models/Course')

// Connect Mongo a create a database courses if doesn't exists
mongoose
	.connect('mongodb://localhost/rolesDB', {
		useNewUrlParser: true
	})
	.then(x => {
		console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
	})
	.catch(err => {
		console.error('Error connecting to mongo', err)
  });
  
  const initialCourses
   = [{
      name: 'webmad1018',
      duration: '9',
      type: `Development`,
    },
    {
     name: 'uxmad1018',
     duration: '8',
     type: `Ux`
    },
    {
     name: 'datamad1018',
     duration: '7',
     type: `Data`
    }
  ]


  Course.collection.drop();

  Course.create(initialCourses
    )
    .then(() => {
      console.log(`Inserted in  BBDD MONGO ${initialCourses
        .length} Courses`)
    })
    .catch((error) => {
      console.log(`Error inserting data in mongo :${error}`)
    })
  