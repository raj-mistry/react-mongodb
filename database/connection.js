//connecting to mongodb

const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
      const uri = process.env.ATLAS_URI;
      await mongoose.connect(process.env.ATLAS_URI2, { useNewUrlParser: true });
      const connection = mongoose.connection;
      connection.once('open', ()=>{
          console.log('MongoDB connected.');
      })
      }
    catch (error) {
        console.log("error")
        console.error(error.message);
        process.exit(1);
    }
  };
  
  module.exports = connectDB;