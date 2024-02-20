import mongoose from "mongoose";

const { Schema, model } = mongoose;

const PostSchema = new Schema({
    title: String,
    desc: String,
    content: { type: String },
    tags: [String],
    imageinfo: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
});

const BlogModel = model('Blog', PostSchema);

export default BlogModel;