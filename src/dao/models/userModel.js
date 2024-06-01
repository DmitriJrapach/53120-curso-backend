import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
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
    githubId: { 
        type: String, 
        unique: true 
    },
    password: {
        type: String,
        minLength: 5,
        required: true,
        hash: true
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts", // Referencia al modelo de carritos
        required: true
    }
});

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;
