const express = require("express");
const router = express.Router();
const User = require('../schemas/User.js');
const jwt = require('jsonwebtoken')



//quote routes
router.get('/quote', async (req,res)=>{
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

router.post('/quote', async (req,res)=>{
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

module.exports = router;