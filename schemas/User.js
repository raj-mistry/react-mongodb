const mongoose = require('mongoose');
const User = require('../schemas/User.js');
//schema within schema (address within user)

const addressSchema = new mongoose.Schema({
    street: String,
    city: String
})

/*
,
        validate: {
            validator: v => v % 2 == 0,
            message: props => `${props.value} is not an even number`
        }
*/

//pass in object with key value pair.
const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true
    },
    age: {
        type: Number,
        min: 1
    },
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
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
    quote: {
        type: String,
        required: false,
        lowercase: false,
    },
    bestFriend: mongoose.SchemaTypes.ObjectId,
    hobbies: [String],
    address: addressSchema
}, {collection: 'users'})

//name of model and the schema
module.exports = mongoose.model("User", userSchema)

