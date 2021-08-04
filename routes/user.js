const { Router } = require('express');
const { check } = require('express-validator');
const api = Router();

const { createUser, deleteUser, recoveryPassword, changePassword, getProfileUser, getUsers } = require('../controllers');
const { validateFields, validateJWT, isAdminUser } = require('../middlewares');
const { existsEmailUser, passwordValidator, existsUser } = require('../helpers');

api.post('/', [
    check('fullname', 'Your full name is required').not().isEmpty(),
    check('email', 'The email is required').not().isEmpty(),
    check('email', 'The email is not valid').isEmail(),
    validateFields,
    check('email').custom(existsEmailUser),
    check('password', 'The password is required').not().isEmpty(),
    validateFields,
    check('password').custom(passwordValidator),
    validateFields
],createUser);

api.post('/recovery-password', [
    check('email', 'The email is required').not().isEmpty(),
    check('email', 'The email is not valid').isEmail(),
    validateFields
], recoveryPassword);

api.get('/profile', [validateJWT], getProfileUser);

api.get('/', [
    validateJWT,
    isAdminUser
],  getUsers);

api.post('/change-password', [
    check('email', 'The email is required').not().isEmpty(),
    check('password', 'The new password is required').not().isEmpty(),
    validateFields,
    check('password').custom(passwordValidator),
    validateFields
], changePassword);

api.delete('/:id', [
    validateJWT,
    check('id', 'Not valid user ID').isMongoId(),
    validateFields,
    check('id').custom(existsUser),
    validateFields
], deleteUser)

module.exports = api;