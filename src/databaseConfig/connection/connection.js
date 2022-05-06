/* eslint-disable no-undef */
require('dotenv').config();
//Mongo connection with Mongoose package
const mongoose = require('mongoose');

const URI = process.env.MONGO_URI;

let connection = mongoose.connect(URI, {
   useNewUrlParser: true,
   useUnifiedTopology: true
}, err => {
   if (err) throw err;
   console.log('Connected to MongoDB!!!')
});

module.exports = {
   connection: connection,
   mongoose: mongoose
};