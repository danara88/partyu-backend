const jwt = require('jsonwebtoken');
const User = require('../models/user');

/**
 * This methods validate if the JWT is valid 
 */
const validateJWT = async (req, res, next) => {
    const token = req.header('x-token');
    if (!token) return res.status(401).json({ message: 'There is not token' });

    try {
        const { uid } = jwt.verify(token, process.env.SECRETJWT);
       
        const user = await User.findById(uid);
        if (!user || !user.status) return res.status(401).json({ message: 'The token is not valid' });

        req.user = user;

        next();
    } catch(err) {
        console.log(err);
        return res.status(401).json({ message: 'The token is not valid' });
    }
}

module.exports = {
    validateJWT
}