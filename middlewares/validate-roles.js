
/**
 * This method verify if the user is admin
 */
const isAdminUser = (req, res, next) => {
    if (!req.user) return res.status(403).json({ message: 'No valid JWT in the headers' });

    const { role, fullname } = req.user;
    if (role !== 'ROLE_ADMIN') return res.status(403).json({ message: `${ fullname } you are not allowed to access here` });

    next();
}

module.exports = {
    isAdminUser
}