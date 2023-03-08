
const express = require("express");
const router = express.Router();
const User = require('../schemas/User.js');
const bcrypt = require('bcrypt');
const saltRounds= 10;
const jwt = require('jsonwebtoken')


//Controller
router.post('/register', async (req,res)=>{

    console.log(req.body);

    const user = await User.findOne({
        email: req.body.email,
    })

    if (user){ //user already exists
        return res.json({status: 'error', error: 'Duplicate email'})
    }

    try{
        bcrypt.hash(req.body.password, saltRounds, async function(err,hashedPassword){
            const user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword
            })
        })
        
        res.json({status: 'ok'})
    } catch(err){
        res.json({status: 'error', error: 'some shit went wrong'})
    }
}) 

router.post('/login', async (req,res)=>{
    console.log(req.body);

    try{
    const user = await User.findOne({
        email: req.body.email,
    })

    if (!user){
        return res.json({status: 'error', error: 'Email does not exist'})
    }

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password).then(async function(result) {
        return result
    });

    if (!isPasswordValid){
        return res.json({status: 'error', error: 'Password does not match'})
    }
    
    const token = jwt.sign({name: user.name, email: user.email}, 'secret123')
    return res.json({status: 'ok', user: token})
    }
    catch(err){
        return res.json({status: 'error', error: 'Try again'})
    }
}) 

module.exports = router;



// async function fetchUser(id){ //unused
//     try{
//         const user = await User.findById(id)
//         return user;
//     }
//     catch(e){
//         console.log(e.message);
//     }
// }