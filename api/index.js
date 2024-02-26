import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import blogRoutes from "./routes/blog.routes.js";

dotenv.config();

const app = express();

const corsOptions = {
    credentials: true,
    origin: ["http://localhost:5173", "http://marcmadeit.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use('/api/blog', blogRoutes);

mongoose.set('strictQuery', true);

export const connectToMongo = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
};

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    connectToMongo();
    console.log(`Server is running on port ${PORT}`);
});

// Export the app instance as a function
export default () => app;
