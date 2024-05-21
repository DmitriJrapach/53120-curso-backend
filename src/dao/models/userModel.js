import { hash } from "bcrypt";
import mongoose from "mongoose";
import cartModel from "./cartModel.js";
import mongoosePaginate from 'mongoose-paginate-v2';

const userCollection = "users";

const userSchema = mongoose.Schema({
    first_name: {
        type: String,
        minLength: 3,
        // required: true
    },
    last_name: {
        type: String,
        minLength: 3,
        // required: true
    },
    email: {
        type: String,
        minLength: 5,
        // required: true,
        unique: true
    },
    
    age: {
        type: Number,
        min: 18,
        // required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'], 
        default: 'user' 
    },
    password: {
        type: String,
        minLength: 5,
        // required: true,
        hash: true
    },
    cart: {        
        type: [{
             cart: {
                 type: mongoose.Schema.Types.ObjectId,
                 ref: "carts" // Referencia al modelo de productos
             },             
         }],
        
        
    }
});


const userModel = mongoose.model(userCollection, userSchema);

export default userModel;