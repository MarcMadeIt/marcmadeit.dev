import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ProjectSchema = new Schema({
    title: String,
    desc: String,
    content: { type: String },
    tags: [String],
    imageinfo: String,
}, {
    timestamps: true,
});

const ProjectModel = model('Project', ProjectSchema);

export default ProjectModel;