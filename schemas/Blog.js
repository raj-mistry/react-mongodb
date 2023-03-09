const mongoose = require("mongoose")


//pass in object with key value pair.
const blogSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true
    },
    text: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: ()=> Date.now()
    },
    updatedAt: {
        type: Date,
        default: ()=> Date.now()
    },
    user: mongoose.SchemaTypes.ObjectId,
}, {collection: 'blogs'})

//name of model and the schema
module.exports = mongoose.model("Blog", blogSchema)

