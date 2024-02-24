import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import session from 'express-session';

import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"
import blogRoutes from "./routes/blog.routes.js"

dotenv.config();

const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", true);
    next();
});

const corsOptions = {
    credentials: true,
    origin: ["http://127.0.0.1:5173", "https://marcmadeit.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Access-Control-Allow-Private-Network"],
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));


app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000,
    },
    store: new session.MemoryStore(),
}));

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use('/api/blog', blogRoutes);

mongoose.set('strictQuery', true);

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

const server = app;

export default server;