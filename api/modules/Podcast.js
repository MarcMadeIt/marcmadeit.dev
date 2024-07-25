import mongoose from "mongoose";

const { Schema, model } = mongoose;

const PodcastSchema = new Schema({
    title: String,
    desc: String,
    link: String,
    tags: [String],
    imageinfo: String,
    audioinfo: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
});

const PodcastModel = model('Podcast', PodcastSchema);

export default PodcastModel;