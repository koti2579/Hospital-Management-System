const jwt = require('jsonwebtoken');

const authMiddleware = {
    verifyPatient: (req, res, next) => {
        const token = req.cookies.patientToken;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
            if (decoded.role !== 'patient') {
                return res.status(403).json({ message: 'Forbidden: Patient access only' });
            }
            req.patientId = decoded.patientId;
            next();
        } catch (err) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
    },

    verifyStaff: (req, res, next) => {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token provided' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
            if (decoded.role === 'patient') {
                return res.status(403).json({ message: 'Forbidden: Staff access only' });
            }
            req.user = decoded;
            next();
        } catch (err) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }
    }
};

module.exports = authMiddleware;
