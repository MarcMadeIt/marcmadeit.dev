import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import User from "../modules/User.js"

const salt = bcrypt.genSaltSync(10);

const secret = process.env.SESSION_SECRET || 'klmslkfmo3i2923fmo23fo23fkk32e2';


export const register = async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Create a new user
        const userDoc = await User.create({ username, password: bcrypt.hashSync(password, salt) });

        // Fetch blogs associated with the user
        const userBlogs = await Blog.find({ author: userDoc._id })
            .sort({ createdAt: -1 })
            .populate('author', 'username');

        // Set session information
        req.session.user = { username, id: userDoc._id };

        // Respond with user and blogs
        res.json({ user: userDoc, blogs: userBlogs });
    } catch (e) {
        console.error('Error during registration:', e);
        res.status(500).json({ message: 'Internal server error' });
    }
};



export const login = async (req, res) => {
    try {
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

            // Log the user information before setting it in the session
            console.log('User information:', { id: userDoc._id, username });

            const token = jwt.sign({ username, id: userDoc._id }, secret, { expiresIn: '1h' });

            // Log the token before setting it in the cookie
            console.log('Token:', token);

            req.session.user = { username, id: userDoc._id };
            res.cookie('token', token, { httpOnly: true, secure: true }).json({
                id: userDoc._id,
                username,
                // Include user information in the response
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
};

export const logout = (req, res) => {
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
};

