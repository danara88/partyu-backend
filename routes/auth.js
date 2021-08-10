const { Router } = require('express');
const { check } = require('express-validator');
const api = Router();

const { login, renewToken } = require('../controllers')
const { validateFields, validateJWT } = require('../middlewares');

api.post('/login', [
    check('email', 'The email is invalid').isEmail(),
    check('password', 'The password is required').not().isEmpty(),
    validateFields
], login);

api.get('/renew',
    validateJWT,
    renewToken
)

module.exports = api;