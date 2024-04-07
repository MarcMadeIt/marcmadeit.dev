import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ProjectSchema = new Schema({
    title: String,
    desc: String,
    link: String,
    tags: [String],
    imageinfo: String,
}, {
    timestamps: true,
});

const ProjectModel = model('Project', ProjectSchema);

export default ProjectModel;