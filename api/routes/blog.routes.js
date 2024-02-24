import express from "express";
import * as blogController from "../controllers/blog.control.js";

const router = express.Router();

router.post("/create", blogController.upload.single('file'), async (req, res, next) => {
    try {
        await blogController.uploadImage(req, res);
        await blogController.createBlog(req, res);
    } catch (error) {
        console.error('Error creating blog:', error);
        res.status(500).json({ error: 'Failed to create blog' });
    }
});

router.get("/get", async (req, res) => {
    try {
        const blogs = await blogController.getBlogs(req, res);
        res.json(blogs);
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ error: 'Failed to fetch blogs' });
    }
});

router.get("/getInfo", async (req, res) => {
    try {
        const blogInfo = await blogController.getBlogInfo(req, res);
        res.json(blogInfo);
    } catch (error) {
        console.error('Error fetching blog info:', error);
        res.status(500).json({ error: 'Failed to fetch blog info' });
    }
});

router.get("/getlimit", async (req, res) => {
    try {
        const blogsLimit = await blogController.getBlogsLimit(req, res);
        res.json(blogsLimit);
    } catch (error) {
        console.error('Error fetching limited blogs:', error);
        res.status(500).json({ error: 'Failed to fetch limited blogs' });
    }
});

router.get("/get/:id", async (req, res) => {
    try {
        const blog = await blogController.getBlogById(req, res);
        res.json(blog);
    } catch (error) {
        console.error('Error fetching blog by ID:', error);
        res.status(500).json({ error: 'Failed to fetch blog by ID' });
    }
});

router.put('/put/:id', blogController.upload.single('file'), async (req, res) => {
    try {
        const updatedBlog = await blogController.updateBlog(req, res);
        res.json(updatedBlog);
    } catch (error) {
        console.error('Error updating blog:', error);
        res.status(500).json({ error: 'Failed to update blog' });
    }
});

router.get("/getbyuser", async (req, res) => {
    try {
        const blogsByUser = await blogController.getBlogsByUser(req, res);
        res.json(blogsByUser);
    } catch (error) {
        console.error('Error fetching blogs by user:', error);
        res.status(500).json({ error: 'Failed to fetch blogs by user' });
    }
});

router.get("/count", async (req, res) => {
    try {
        const blogCount = await blogController.getBlogCount(req, res);
        res.json(blogCount);
    } catch (error) {
        console.error('Error fetching blog count:', error);
        res.status(500).json({ error: 'Failed to fetch blog count' });
    }
});

router.delete("/get/:id", async (req, res) => {
    try {
        const deletedBlog = await blogController.deleteBlog(req, res);
        res.json(deletedBlog);
    } catch (error) {
        console.error('Error deleting blog:', error);
        res.status(500).json({ error: 'Failed to delete blog' });
    }
});

export default router;
