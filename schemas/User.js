const mongoose = require('mongoose');

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
    name: String,
    age: {
        type: Number,
        min: 1
    },
    email: {
        type: String,
        required: true,
        lowercase: true
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
    bestFriend: mongoose.SchemaTypes.ObjectId,
    hobbies: [String],
    address: addressSchema
})

//name of model and the schema
module.exports = mongoose.model("User", userSchema)

