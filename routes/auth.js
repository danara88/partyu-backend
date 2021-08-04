const { Router } = require('express');
const { check } = require('express-validator');
const api = Router();

const { login } = require('../controllers')
const { validateFields } = require('../middlewares');

api.post('/login', [
    check('email', 'The email is invalid').isEmail(),
    check('password', 'The password is required').not().isEmpty(),
    validateFields
], login);

module.exports = api;