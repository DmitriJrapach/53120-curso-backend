import mongoose from "mongoose";

const userCollection = "users";

const userSchema = mongoose.Schema({
    first_name: {
        type: String,
        minLength: 3,
        required: true
    },
    last_name: {
        type: String,
        minLength: 3,
        required: true
    },
    email: {
        type: String,
        minLength: 5,
        required: true,
        unique: true
    },
    
    age: {
        type: Number,
        min: 18,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'], 
        default: 'user' 
    },
    password: {
        type: String,
        minLength: 5,
        required: true
    },
});

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;