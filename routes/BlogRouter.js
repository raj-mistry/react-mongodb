const express = require("express");
const router = express.Router();
const Blog = require('../schemas/Blog.js');
const jwt = require('jsonwebtoken')
var ObjectId = require('mongodb').ObjectId;


//quote routes
router.get('/blog', async (req,res)=>{
    const token = req.headers['x-access-token']

    try {
        const decoded = jwt.verify(token,'secret123')
        const id = new ObjectId(decoded.id)
        const blogs = await Blog.find({user: id}).sort({createdAt:-1});
        return res.json({status: 'ok', blogs: blogs})

    } catch(error){
        res.json({status: 'error', error: 'invalid token'})
    }
})

router.post('/blog', async (req,res)=>{
    const token = req.headers['x-access-token']

    try {
        const decoded = jwt.verify(token,'secret123')
        const id = decoded.id
        await Blog.create({title: req.body.title, text: req.body.text, user: id })
        return res.json({status: 'ok'})

    } catch(error){
        res.json({status: 'error', error: 'invalid token'})
    }
})

router.put('/blog', async (req,res)=>{
    const token = req.headers['x-access-token']

    try {
        const decoded = jwt.verify(token,'secret123')
        const id = decoded.id
        const filter = {_id: new ObjectId(req.body._id)}
        const options = {upsert: false}
        const updateBlog = {
            $set: {
                title: req.body.title,
                text: req.body.text,
                updatedAt: Date.now()
            }
        }
        await Blog.updateOne(filter, updateBlog, options);
        return res.json({status: 'ok'})

    } catch(error){
        res.json({status: 'error', error: 'invalid token'})
    }
})

router.delete('/blog', async (req,res)=>{
    const token = req.headers['x-access-token']

    try {
        const decoded = jwt.verify(token,'secret123')
        const response = await Blog.deleteOne({_id: new ObjectId(req.body.id)})
        return res.json({status: 'ok'})

    } catch(error){
        res.json({status: 'error', error: 'invalid token'})
    }
})

module.exports = router;