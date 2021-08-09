const { Router } = require('express');
const { check } = require('express-validator');
const api = Router();

const Participant = require('../models/participant');
const Event = require('../models/event');
const { attendToEvent, notAttendToEvent, listParticipants, getMyParticipations } = require('../controllers');
const { existsDataId } = require('../helpers');
const { validateJWT, validateFields } = require('../middlewares');


api.post('/attend', [
    validateJWT,
    check('event', 'The event is required').not().isEmpty(),
    check('event', 'The event ID is invalid').isMongoId(),
    check('event').custom(event => existsDataId(Event, event)),
    validateFields
], attendToEvent);

api.get('/:eventID', [
    validateJWT,
    check('eventID', 'The event ID is invalid').isMongoId(),
    check('eventID').custom(eventID => existsDataId(Event, eventID)),
    validateFields
], listParticipants);

api.get('/my-participations/list', [
    validateJWT,
], getMyParticipations);

api.post('/not-attend', [
    validateJWT,
    check('event', 'The event is required').not().isEmpty(),
    check('event', 'The event ID is invalid').isMongoId(),
    check('event').custom(event => existsDataId(Event, event)),
    validateFields
], notAttendToEvent);


module.exports = api;