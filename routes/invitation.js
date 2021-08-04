const { Router } = require('express');
const { check } = require('express-validator');
const api = Router();

const Event = require('../models/event');
const User = require('../models/user');
const Invitation = require('../models/invitation');
const { sendInvitation, acceptInvitation, rejectInvitation, getInvitations, myInvitations, deleteInvitation } = require('../controllers/invitation');
const { existsDataId } = require('../helpers');
const { validateJWT, isAdminUser, validateFields } = require('../middlewares');

api.post('/', [
    validateJWT,
    isAdminUser,
    check('user', 'The user is required').not().isEmpty(),
    check('user', 'The user ID is not valid').isMongoId(),
    check('user').custom(user => existsDataId(User, user)),

    check('event', 'The event is required').not().isEmpty(),
    check('event', 'The event ID is not valid').isMongoId(),
    check('event').custom(event => existsDataId(Event, event)),
    validateFields
], sendInvitation);

api.post('/accept/:invitationID', [
    validateJWT,
    check('invitationID', 'The invitation ID is not valid').isMongoId(),
    check('invitationID').custom(invitationID => existsDataId(Invitation, invitationID)),
    validateFields
], acceptInvitation);

api.post('/reject/:invitationID', [
    validateJWT,
    check('invitationID', 'The invitation ID is not valid').isMongoId(),
    check('invitationID').custom(invitationID => existsDataId(Invitation, invitationID)),
    validateFields
], rejectInvitation);

api.get('/:eventID', [
    validateJWT,
    check('eventID', 'The event ID is not valid').isMongoId(),
    check('eventID').custom(eventID => existsDataId(Event, eventID)),
    validateFields
], getInvitations);

api.get('/', [
    validateJWT
], myInvitations);

api.delete('/:id', [
    validateJWT,
    isAdminUser,
    check('id', 'The invitation ID is not valid').isMongoId(),
    check('id').custom(id => existsDataId(Invitation, id)),
    validateFields
], deleteInvitation);


module.exports = api;