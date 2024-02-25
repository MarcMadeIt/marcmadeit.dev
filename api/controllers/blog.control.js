
import crypto from 'crypto';
import sharp from 'sharp';
import multer from 'multer';
import dotenv from 'dotenv';
import Blog from '../modules/Blog.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";


dotenv.config();

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accesKey = process.env.ACCESS_KEY;
const secretAccesskey = process.env.SECRET_ACCESS_KEY;

const s3Client = new S3Client({
    credentials: {
        accessKeyId: accesKey,
        secretAccessKey: secretAccesskey,
    },
    region: bucketRegion,
});



//Upload af billede til AWS S3

const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });

// Backend: blogController.js
export const uploadImage = async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
    try {
        const imageKey = crypto.randomBytes(20).toString("hex");

        const buffer = await sharp(req.file.buffer)
            .resize({ height: 1000, width: 1920, fit: "cover" })
            .toBuffer();

        // Prepare parameters for uploading to S3
        const uploadParams = {
            Bucket: bucketName,
            Key: imageKey,
            Body: buffer,
            ContentType: req.file.mimetype,
        };

        await s3Client.send(new PutObjectCommand(uploadParams));

        const imageUrl = `https://${bucketName}.s3.amazonaws.com/${imageKey}`;
        req.imageUrl = imageUrl;
        next();

    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
};

//Oprettelse af Blogpost

export const createBlog = async (req, res) => {
    try {
        const { title, desc, content, tags } = req.body;

        const imageUrl = req.imageUrl;

        const tagsArray = tags ? tags.split(',') : [];

        // Verify the token
        const { token } = req.cookies;
        jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
            try {
                if (err) {
                    throw err;
                }

                const newBlog = new Blog({
                    title,
                    desc,
                    content,
                    tags: tagsArray,
                    author: info.id, // Brug info.id som forfatter
                    imageinfo: imageUrl,
                });

                const savedBlog = await newBlog.save();
                res.status(201).json({
                    message: 'Blog created successfully',
                    blog: savedBlog,
                    tokenInfo: {
                        id: info.id,
                        username: info.username,
                    },
                });
            } catch (error) {
                console.error('Error creating blog:', error);

                if (error.name === 'JsonWebTokenError') {
                    return res.status(401).json({ error: 'Unauthorized' });
                }

                res.status(500).json({ error: 'Failed to create blog' });
            }
        });
    } catch (error) {
        console.error('Error creating blog:', error);
        res.status(500).json({ error: 'Failed to create blog' });
    }
};

//Fremkald alle blogs til fremvisning
export const getBlogsLimit = async (req, res) => {
    try {
        const { page = 1, limit = 3 } = req.query;
        console.log('Requested Page:', page); // Add this log
        const skip = (page - 1) * limit;

        const blogs = await Blog.find()
            .sort({ createdAt: -1 })
            .populate('author', ['username'])
            .skip(skip)
            .limit(parseInt(limit));

        const totalCount = await Blog.countDocuments();
        res.status(200).json({ blogs, totalCount });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ error: 'Failed to fetch blogs' });
    }
};

export const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 }).populate('author', ['username']);
        res.status(200).json(blogs);
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ error: 'Failed to fetch blogs' });
    }
};

//Fremkald specefik blogpost

export const getBlogById = async (req, res) => {

    const { id } = req.params;
    const blogDoc = await Blog.findById(id).populate('author', ['username']);
    if (!blogDoc) {
        return res.status(404).json({ error: 'Blog post not found' });
    }
    res.json(blogDoc);
};

//Fremkald info og få brugernavn til blogpost
export const getBlogInfo = async (req, res) => {

    try {
        const { token } = req.cookies;
        jwt.verify(token, secret, {}, async (err, info) => {
            if (err) {
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            try {
                const userBlogs = await Blog.find({ author: info.id }).sort({ createdAt: -1 }).populate('author', ['username']);
                res.json(userBlogs);
            } catch (error) {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    } catch (error) {
        // Error in /blog route
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

//Updating af blog
export const updateBlog = async (req, res) => {
    const { id } = req.params;

    const { token } = req.cookies;

    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
        if (err) throw err;

        const { title, desc, content, tags } = req.body;

        try {
            const blogDoc = await Blog.findById(id);

            if (!blogDoc) {
                return res.status(404).json('Blog post not found');
            }

            const isAuthor = JSON.stringify(blogDoc.author) === JSON.stringify(info.id);

            if (!isAuthor) {
                return res.status(400).json('You are not the author');
            }

            blogDoc.title = title;
            blogDoc.desc = desc;
            blogDoc.content = content;
            blogDoc.tags = tags;

            await blogDoc.save();

            res.json(blogDoc);
        } catch (error) {
            console.error('Error updating blog post:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
};

//Fremkald blogposts tilknyttet til bestemt bruger

export const getBlogsByUser = async (req, res) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        try {
            const { id: userId } = jwt.verify(token, process.env.JWT_SECRET);
            const userBlogs = await Blog.find({ author: userId })
                .sort({ createdAt: -1 })
                .populate('author', ['username']);
            if (!userBlogs || userBlogs.length === 0) {
                return res.status(404).json({ error: 'No blogs found for the user' });
            }
            res.status(200).json(userBlogs);
        } catch (error) {
            console.error('Error fetching blogs:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } catch (error) {
        console.error('Error in /blog route:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getBlogCount = async (req, res) => {

    const { token } = req.cookies;

    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
        if (err) {
            console.error('Error verifying token:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        try {
            const blogCount = await Blog.countDocuments({ author: info.id });
            res.status(200).json({ blogCount });
        } catch (error) {
            console.error('Error fetching blog count:', error);
            res.status(500).json({ error: 'Failed to fetch blog count' });
        }
    });
};
export const deleteBlog = async (req, res) => {
    const { id } = req.params;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid blog ID' });
        }

        const deletedBlog = await Blog.findByIdAndDelete(id);

        if (!deletedBlog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        res.json({ message: 'Blog deleted successfully' });
    } catch (error) {
        console.error('Error deleting blog:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};