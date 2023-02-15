require('dotenv').config();
const express = require('express');
const app = express(); 
const port = process.env.PORT || 5000; 
const cors = require('cors')
const jwt = require('jsonwebtoken')
app.use(cors())
app.use(express.json())
const mongoose = require('mongoose');



//importing schemas
const User = require('./schemas/User.js')


//connecting to mongodb
const uri = process.env.ATLAS_URI;
mongoose.connect(process.env.ATLAS_URI2, {useNewUrlParser: true});
const connection = mongoose.connection;
connection.once('open', ()=>{
    console.log('MongoDB connected.');
})

//opening port for server to list.
app.listen(port, () => console.log(`Listening on port ${port}`)); 


//mongo helper functions

async function fetchUser(id){ //unused
    try{
        const user = await User.findById(id)
        return user;
    }
    catch(e){
        console.log(e.message);
    }
}


//Controller
app.post('/api/register', async (req,res)=>{

    console.log(req.body);

    try{
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })
        res.json({status: 'ok'})
    } catch(err){
        res.json({status: 'error', error: 'Duplicate email'})
    }
}) 

app.post('/api/login', async (req,res)=>{
    console.log(req.body);

    const user = await User.findOne({
        email: req.body.email,
        password: req.body.password
    })

    if (user){
        const token = jwt.sign({name: user.name, email: user.email}, 'secret123')
        return res.json({status: 'ok', user: token})
    }
    else{
        return res.json({status: 'error', user: false})
    }
}) 

app.get('/api/quote', async (req,res)=>{
    const token = req.headers['x-access-token']

    try {
        const decoded = jwt.verify(token,'secret123')
        const email = decoded.email
        const user = await User.findOne({email: email})
        console.log(user)
        return res.json({status: 'ok', quote: user.quote})

    } catch(error){
        res.json({status: 'error', error: 'invalid token'})
    }
})

app.post('/api/quote', async (req,res)=>{
    const token = req.headers['x-access-token']

    try {
        const decoded = jwt.verify(token,'secret123')
        const email = decoded.email
        await User.updateOne({email: email}, {$set: {quote: req.body.quote}})
        return res.json({status: 'ok'})

    } catch(error){
        res.json({status: 'error', error: 'invalid token'})
    }
})