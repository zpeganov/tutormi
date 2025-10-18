import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';
import Tutor from '../models/Tutor.js';

export const protect = async (req, res, next) => {
    let token;

    // 1. Check if the token exists in the HTTP-Only cookie
    if (req.cookies && req.cookies.token) {
        try {
            // 2. Get the token from the cookie
            token = req.cookies.token;

            // 3. Verify the token's signature
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 4. Get the user from the database using the ID in the token
            //    We attach the user to the request object, excluding the password
            req.student = await Student.findById(decoded.id).select('-password');

            if (!req.student) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            // 5. Move on to the next middleware or the route handler
            next();

        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    // If there's no token at all
    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

export const protectTutor = async (req, res, next) => {
    let token;

    if (req.cookies && req.cookies.token) {
        try {
            token = req.cookies.token;
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.tutor = await Tutor.findById(decoded.id).select('-password');

            if (!req.tutor) {
                return res.status(401).json({ message: 'Not authorized, tutor not found' });
            }
            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};
