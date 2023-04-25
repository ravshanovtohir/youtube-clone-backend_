import mongoose, { Schema } from "mongoose";

const videoSchema = new mongoose.Schema({
    video_title: { type: String, default: null },
    video_url: { type: String },
    video_size: { type: String },
    video_created_at: { type: Date, default: Date.now },
    user_id: { type: Schema.Types.ObjectId, requires: true, ref: "users" },
})

export default mongoose.model("videos", videoSchema)
