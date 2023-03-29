require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 5000; 
const cors = require('cors');
const jwt = require('jsonwebtoken');
const connectDB = require("./database/connection");
const path = require("path")

app.use(cors())
app.use(express.json())


app.use(express.static(path.join(__dirname, "client/build")))


if (process.env.NODE_ENV === "production"){
    app.use('/',express.static(path.join(__dirname, "client/build")))
}


//connect to db
connectDB();

//auth route
const authenticationRoute = require('./routes/Authentication');
app.use("/api", authenticationRoute);

//user routes
const userRoute = require('./routes/User');
app.use("/api", userRoute);

//quotes routes
const quoteRoute = require('./routes/Quotes');
app.use("/api", quoteRoute);

//blog routes
const blogRoute = require('./routes/BlogRouter');
app.use("/api", blogRoute);


//react router requests
app.get('*', function(req, res) {
    res.sendFile('index.html', {root: path.join(__dirname, 'client/build/')});
  });

//opening port for server to list.
app.listen(port, () => console.log(`Listening on port ${port}`)); 


