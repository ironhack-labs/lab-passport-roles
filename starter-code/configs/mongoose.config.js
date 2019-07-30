const mongoose     = require('mongoose');

mongoose  // NO LO QUITES QUE PETAA
.connect('mongodb://localhost/starter-code', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });


  module.exports = mongoose           //NO OLVIDAR EL MODULE EXPORTS