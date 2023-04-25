import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
    user_name: { type: String, required: true, unique: true },
    profile_img: { type: String },
    password: { type: String },
    user_created_at: { type: Date, default: Date.now }
})

export default mongoose.model("users", userSchema)