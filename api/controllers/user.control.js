import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../modules/User.js';
import bcrypt from 'bcryptjs';
dotenv.config();



export const profile = (req, res) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const { username } = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ username }); // Send the username directly in the response
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const GetUsername = async (req, res) => {
    try {
        const { token } = req.cookies;

        jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
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
};


export const updateUsername = async (req, res) => {
    const { id } = req.params;
    const { token } = req.cookies;

    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
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

            // Update only the username field
            user.username = newUsername;
            await user.save();

            res.json({ success: true, message: 'Username updated successfully' });
        } catch (error) {
            console.error('Error updating username:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
};


export const updatePassword = async (req, res) => {
    const { id } = req.params;
    const { token } = req.cookies;

    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
        if (err) {
            console.error('Error verifying token:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const { newPassword, currentPassword } = req.body;

        try {
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
};
