const dbValidators = require('./db-validators');
const pwdValidator = require('./pwd-validator');
const sendMail = require('./send-mail');
const generateJWT = require('./generate-jwt');

module.exports = {
    ...dbValidators,
    ...pwdValidator,
    ...sendMail,
    ...generateJWT,
}