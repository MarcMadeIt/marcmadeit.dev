import mongoose from 'mongoose';
import Blog from "../models/Blog";
// Andre importerede filer efter behov

export default async (req, res) => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        const blogs = await Blog.find().sort({ createdAt: -1 }).populate('author', ['username']);
        res.status(200).json(blogs);
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ error: 'Failed to fetch blogs' });
    }
};