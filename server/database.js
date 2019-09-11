'use strict';

const mongoose = require('mongoose');

mongoose.set('useCreateIndex', true);

exports.connect = ({ uri }) => mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true });
exports.disconnect = mongoose.disconnect;
