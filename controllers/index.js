const userController = require('./user');
const authController = require('./auth');
const regionController = require('./region');
const eventController = require('./event');
const participantController = require('./participant');
const invitationController = require('./invitation');

module.exports = {
    ...userController,
    ...authController,
    ...regionController,
    ...eventController,
    ...participantController,
    ...invitationController,
}   