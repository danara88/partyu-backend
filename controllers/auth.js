const bcryptjs = require('bcryptjs');
const User = require('../models/user');

const { generateJWT } = require('../helpers/generate-jwt');

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({email});

    if (!user) return res.status(401).json({ message: 'The email or password is incorrect' });

    const compare = bcryptjs.compareSync(password, user.password);
    if (!compare) return res.status(401).json({ message: 'The email or password is incorrect' });

    // Generate JWT token
    const token = await generateJWT(user._id);

    res.json({ token });
}

module.exports = {
    login,
}