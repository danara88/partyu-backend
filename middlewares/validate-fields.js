const { validationResult } = require('express-validator');

/**
 * This method throw errors of express validator
 */
const validateFields = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.mapped());
    } else {
        next();
    }
}

module.exports = {
    validateFields
}