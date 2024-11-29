const jwt = require('jsonwebtoken');
const User = require('./models/User');

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.authToken;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, /*process.env.JWT_SECRET*/"Secret", async (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        try {
            const user = await User.findById(decoded.userId).select('-password');
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            req.user = user; // Attach user info to request object
            next(); // Proceed to the next middleware or route handler
        } catch (error) {
            return res.status(500).json({ message: 'Server error', error });
        }
    });
};

module.exports = authMiddleware;