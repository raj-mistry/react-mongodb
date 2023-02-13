require('dotenv').config();

const express = require('express');
const app = express(); 
const port = process.env.PORT || 5000; 

const cors = require('cors')
app.use(cors())

app.use(express.json())

const mongoose = require('mongoose');

//importing schemas
const User = require('./schemas/User.js')


//mongo functions
async function createUser(){
    try{
        const user = await User.create(
            {name: "Raj", 
            age: 23,
            email: "rajmistry@gmail.com",
            hobbies: ['drawing', 'animating', 'coding'],
            address: {
                street: "123 Street Drive"
            }
        });
    }
    catch(e){
        console.log(e.message);
    }

    //the code below does the same thing as User.create()

    // const user = new User({name: 'Raj', age: '22'});
    // await user.save().then(()=>{
    //     console.log('user saved.')
    // })
}


async function fetchUser(id){
    try{
        const user = await User.findById(id)
        return user;
    }
    catch(e){
        console.log(e.message);
    }
}




const uri = process.env.ATLAS_URI;
mongoose.connect(process.env.ATLAS_URI2, {useNewUrlParser: true});

const connection = mongoose.connection;

connection.once('open', ()=>{
    console.log('MongoDB connected.');
})

app.listen(port, () => console.log(`Listening on port ${port}`)); 


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
            return res.json({status: 'ok', user: true})
        }
        else{
            return res.json({status: 'error', user: false})
        }
        res.json({status: 'ok'})

}) 



app.get('/express_backend', (req, res) => { //Line 9
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' }); //Line 10
}); //Line 11


app.get('/users', (req, res) => { //Line 9
    res.send({  }); //Line 10
  }); //Line 11


app.get('/users/:id', async (req, res) => { //Line 9

    const user = await fetchUser(req.params.id)

    res.send(user); //Line 10
}); //Line 11