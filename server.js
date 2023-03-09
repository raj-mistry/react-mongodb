require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 5000; 
const cors = require('cors');
const jwt = require('jsonwebtoken');
const connectDB = require("./database/connection");

app.use(cors())
app.use(express.json())

//connect to db
connectDB();

//auth route
const authenticationRoute = require('./routes/Authentication');
app.use("/api", authenticationRoute);

//quotes routes
const quoteRoute = require('./routes/Quotes');
app.use("/api", quoteRoute);

//blog routes
const blogRoute = require('./routes/BlogRouter');
app.use("/api", blogRoute);

//opening port for server to list.
app.listen(port, () => console.log(`Listening on port ${port}`)); 


