import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import sharp from 'sharp';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import User from "./modules/User.js"
import Blog from "./modules/Blog.js"
import Project from "./modules/Project.js"
import session from 'express-session';
import apicache from "apicache"

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import ProjectModel from './modules/Project.js';

dotenv.config();

const app = express();

const secret = process.env.SESSION_SECRET;
const salt = bcrypt.genSaltSync(10);
const cache = apicache.middleware;

const corsOptions = {
    credentials: true,
    origin: ['https://marcmadeit.vercel.app', 'http://localhost:5173'],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

mongoose.set('strictQuery', true);

const connectToMongo = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
};

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true },
    })
);

// S3 Configuration ---------------------- S3 Configuration

const s3Client = new S3Client({
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
    },
    region: process.env.BUCKET_REGION,
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// BLOG -------------------------------------------------------------- BLOG

app.put('/api/blog/put/:id', upload.single('file'), async (req, res) => {
    try {
        await connectToMongo();
        const { id } = req.params;
        const { token } = req.cookies;

        jwt.verify(token, secret, {}, async (err, info) => {
            if (err) {
                console.error('Error verifying token:', err);

                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({ error: 'Token expired' });
                }

                return res.status(500).json({ error: 'Internal Server Error' });
            }

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

                // Check if a new file is uploaded
                if (req.file) {
                    const bucketName = process.env.BUCKET_NAME;
                    const imageKey = `image_${Date.now()}_${Math.floor(Math.random() * 1000)}_${req.file.originalname}`;

                    // Function to generate upload parameters for S3
                    const generateUploadParams = async (fileBuffer, mimetype) => {
                        const buffer = await sharp(fileBuffer)
                            .resize({ height: 1000, width: 1920, fit: "cover" })
                            .toBuffer();

                        return {
                            Bucket: bucketName,
                            Key: imageKey,
                            Body: buffer,
                            ContentType: mimetype,
                        };
                    };

                    // Upload the new image to S3
                    const uploadParams = await generateUploadParams(req.file.buffer, req.file.mimetype);
                    await s3Client.send(new PutObjectCommand(uploadParams));

                    // Update the image URL in the database
                    blogDoc.imageinfo = `https://${bucketName}.s3.amazonaws.com/${imageKey}`;
                }

                // Update other fields in the blog document
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
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


//Fremkaldelse af alle blogs til fremvisning, men sideopdelt
app.get("/api/blog/getlimit", async (req, res) => {
    try {
        await connectToMongo();
        const { page = 1, limit = 3 } = req.query;
        console.log('Requested Page:', page);
        const skip = (page - 1) * limit;

        const blogs = await Blog.find()
            .sort({ createdAt: -1 })
            .populate('author', ['username']).select('-content')
            .skip(skip)
            .limit(parseInt(limit));

        const totalCount = await Blog.countDocuments();
        res.setHeader('Cache-Control', 'public, max-age=3600');
        res.status(200).json({ blogs, totalCount });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get("/api/blog/get", async (req, res) => {
    try {
        await connectToMongo();

        // Fetch only the latest two blog posts, excluding the "content" field
        const blogs = await Blog.find().sort({ createdAt: -1 }).limit(2).populate('author', ['username']).select('-content');

        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.status(200).json(blogs);
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Fremkaldelse af specifik blogpost
app.get("/api/blog/get/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await connectToMongo();


        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid blog ID' });
        }

        const blogDoc = await Blog.findById(id).populate('author', ['username']);

        if (!blogDoc) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        res.json(blogDoc);
    } catch (error) {
        console.error('Error fetching specific blog post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Fremkald info og få brugernavn til blogpost
app.get("/api/blog/get/:id", cache('20 minutes'), async (req, res) => {

    try {
        await connectToMongo();

        const { token } = req.cookies;
        jwt.verify(token, secret, {}, async (err, info) => {
            if (err) {
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            try {
                const userBlogs = await Blog.find({ author: info.id }).sort({ createdAt: -1 }).populate('author', ['username']);
                res.setHeader('Cache-Control', 'public, max-age=3600');
                res.json(userBlogs);
            } catch (error) {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.get("/api/blog/getbyuser", async (req, res) => {
    try {
        await connectToMongo();
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        try {
            const { id: userId } = jwt.verify(token, secret);
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
        console.error('Error in /api/blog/getbyuser route:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


//Preview counting the blog for a specific user
app.get("/api/blog/count", async (req, res) => {

    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
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
});

app.delete("/api/blog/get/:id", async (req, res) => {
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
});

//Updating af blog
app.put('/api/blog/put/:id', upload.single('file'), async (req, res) => {
    try {
        await connectToMongo();
        const { id } = req.params;
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        jwt.verify(token, secret, {}, async (err, info) => {
            if (err) {
                console.error('Error verifying token:', err);

                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({ error: 'Token expired' });
                }

                return res.status(500).json({ error: 'Internal Server Error' });
            }

            const { title, desc, content, tags } = req.body;

            try {
                const blogDoc = await Blog.findById(id);

                if (!blogDoc) {
                    return res.status(404).json({ error: 'Blog post not found' });
                }

                const isAuthor = JSON.stringify(blogDoc.author) === JSON.stringify(info.id);

                if (!isAuthor) {
                    return res.status(403).json({ error: 'You are not the author' });
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
    } catch (error) {
        console.error('Error in PUT request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// PROJECT ---------------------------------------------------------- PROJECT

app.post("/api/project/create", upload.single('file'), async (req, res) => {
    try {
        const bucketName = process.env.BUCKET_NAME;

        // Function to generate upload parameters for S3
        const generateUploadParams = async (fileBuffer, mimetype) => {
            const imageKey = crypto.randomBytes(20).toString("hex");
            const buffer = await sharp(fileBuffer)
                .resize({ height: 1000, width: 1920, fit: "cover" })
                .toBuffer();

            return {
                Bucket: bucketName,
                Key: imageKey,
                Body: buffer,
                ContentType: mimetype,
            };
        };

        // Use the existing S3 client to send the object to S3
        const uploadParams = await generateUploadParams(req.file.buffer, req.file.mimetype);
        await s3Client.send(new PutObjectCommand(uploadParams));

        const imageUrl = `https://${bucketName}.s3.amazonaws.com/${uploadParams.Key}`;

        // Project creation logic
        await connectToMongo();
        const { title, desc, tags, link } = req.body;
        const tagsArray = tags ? tags.split(',') : [];
        const { token } = req.cookies;

        jwt.verify(token, secret, {}, async (err, info) => {
            if (err) {
                console.error('Error verifying token:', err);
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const newProject = new Project({
                title,
                link,
                desc,
                tags: tagsArray,
                author: info.id,
                imageinfo: imageUrl,
            });

            const savedProject = await newProject.save();

            res.status(201).json({
                message: 'Project created successfully',
                project: savedProject,
                tokenInfo: {
                    id: info.id,
                    username: info.username,
                },
            });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get("/api/project/get", async (req, res) => {
    try {
        await connectToMongo();

        // Fetch only the latest two blog posts, excluding the "content" field
        const projects = await ProjectModel.find().sort({ createdAt: -1 });

        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.status(200).json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get("/api/project/getbyuser", async (req, res) => {
    try {
        await connectToMongo();
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        try {
            const { id: userId } = jwt.verify(token, secret);
            const userProjects = await Project.find({ author: userId })
                .sort({ createdAt: -1 })
                .populate('author', ['username']);
            if (!userProjects || userProjects.length === 0) {
                return res.status(404).json({ error: 'No Projects found for the user' });
            }
            res.status(200).json(userProjects);
        } catch (error) {
            console.error('Error fetching Project:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } catch (error) {
        console.error('Error in /api/project/getbyuser route:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete("/api/project/get/:id", async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid Project ID' });
        }

        const deletedProject = await Project.findByIdAndDelete(id);

        if (!deletedProject) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting Project:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// AUTH ------------------------------------------------------- AUTH


app.post("/api/auth/register", async (req, res) => {
    const { username, password } = req.body;

    try {
        await connectToMongo();
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const userDoc = await User.create({ username, password: bcrypt.hashSync(password, salt) });

        const userBlogs = await Blog.find({ author: userDoc._id })
            .sort({ createdAt: -1 })
            .populate('author', 'username');
        req.session.user = { username, id: userDoc._id };
        res.json({ user: userDoc, blogs: userBlogs });
    } catch (e) {
        console.error('Error during registration:', e);
        res.status(500).json({ message: 'Internal server error' });
    }
});



app.post("/api/auth/login", cache('20 minutes'), async (req, res) => {
    try {
        await connectToMongo();
        console.log('Before login process');
        const { username, password } = req.body;
        const userDoc = await User.findOne({ username });
        console.log('After login process');

        if (!userDoc) {
            return res.status(400).json({ error: 'User not found' });
        }

        const passOk = bcrypt.compareSync(password, userDoc.password);

        if (passOk) {
            console.log('Password is OK');
            console.log('User information:', { id: userDoc._id, username });

            const token = jwt.sign({ username, id: userDoc._id }, secret, { expiresIn: '1h' });
            console.log('Token:', token);

            req.session.user = { username, id: userDoc._id };
            res.cookie('token', token, { httpOnly: true, secure: true }).json({
                id: userDoc._id,
                username,
                user: { id: userDoc._id, username },
            });
        } else {
            console.log('Wrong credentials');
            res.status(400).json({ error: 'Wrong credentials' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post("/api/auth/logout", (req, res) => {
    console.log('User attempting logout:', req.session.user);
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        console.log('User successfully logged out.');
        res.clearCookie('connect.sid');
        res.json({ message: 'Logout successful' });
    });
});

// USER ----------------------------------------------------------- USER 

app.get("/api/user/profile", (req, res) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const { username } = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ username });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get("/api/user/getusername", async (req, res) => {
    try {
        await connectToMongo();
        const { token } = req.cookies;

        jwt.verify(token, secret, {}, async (err, info) => {
            if (err) {
                console.error('Error verifying token:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            try {
                const user = await User.findById(info.id);

                if (!user) {
                    return res.status(404).json({ error: 'User not found' });
                }

                const { username } = user;
                res.json({ _id: info.id, username });
            } catch (error) {
                console.error('Error fetching user:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.put("/api/user/updateusername/:id", async (req, res) => {
    try {
        await connectToMongo();

        const { token } = req.cookies;

        jwt.verify(token, secret, {}, async (err, info) => {
            if (err) {
                console.error('Error verifying token:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            const { newUsername } = req.body;

            try {
                const user = await User.findById(info.id);

                if (!user) {
                    return res.status(404).json({ error: 'User not found' });
                }
                user.username = newUsername;
                await user.save();

                res.json({ success: true, message: 'Username updated successfully' });
            } catch (error) {
                console.error('Error updating username:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.put("/api/user/updateusername/:id", async (req, res) => {
    const { token } = req.cookies;

    jwt.verify(token, secret, {}, async (err, info) => {
        if (err) {
            console.error('Error verifying token:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const { newPassword, currentPassword } = req.body;

        try {
            await connectToMongo();
            const user = await User.findById(info.id);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const passwordMatch = bcrypt.compareSync(currentPassword, user.password);

            if (!passwordMatch) {
                return res.status(401).json({ error: 'Incorrect current password' });
            }

            // Update only the password field
            user.password = bcrypt.hashSync(newPassword, 10);
            await user.save();

            res.json({ success: true, message: 'Password updated successfully' });
        } catch (error) {
            console.error('Error updating password:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
});


app.listen(8000, () => {
    console.log(`Server is running`);
});
