import mongoose from "mongoose";
import  { UserStock }  from "./userStock.model.js";

const userSchema = new mongoose.Schema({
    fullname: { type: String, required: true },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please provide a valid email address']
    },
    password: { type: String, required: true },
    stocks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserStock' }],
    walletBalance : { 
        type: Number, 
        required: true, 
        default: 0
    }
});

export const User = mongoose.model('User', userSchema);