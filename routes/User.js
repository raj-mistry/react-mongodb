
const express = require("express");
const router = express.Router();
const User = require('../schemas/User.js');
const jwt = require('jsonwebtoken')
var ObjectId = require('mongodb').ObjectId;


router.get('/user', async (req,res)=>{

    try{
    const user = await User.findOne({
        _id: new ObjectId(req.query.id)
    })

    if (!user){
        return res.json({status: 'error', error: 'User does not exist'})
    }
    return res.json({status: 'ok', user: user})
    
    }catch(err){
        return res.json({status: 'error', error: 'Try again'})
    }
}) 

module.exports = router;