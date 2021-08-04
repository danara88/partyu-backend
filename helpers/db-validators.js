const User = require('../models/user');

/**
 * Validate if the user email is not registered yet
 */
const existsEmailUser = async (email) => {
    const user = await User.findOne({ email });
    if (user) throw new Error(`The email ${ email } is already registered`);
}

/**
 * Validate if the user exists
 */
const existsUser = async (id) => {
    const user = await User.findById(id);
    if (!user) throw new Error(`The user with ID ${id} does not exists`);
}

/**
 * Validate if a document exists by the ID
 */
const existsDataId = async (obj = User, id) => {
    const data = await obj.findById(id);
    if (!data) throw new Error(`The ID ${ id } does not match with any result`);
}


module.exports = {
    existsEmailUser,
    existsUser,
    existsDataId
}