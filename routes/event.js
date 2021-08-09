const { Router } = require('express');
const { check } = require('express-validator');
const api = Router();

const Event = require('../models/event');
const Region = require('../models/region');
const { createEvent, getEvents, getEvent, updateEvent, deleteEvent, 
        getEventsByRegion, getMyPublicEvents, getMyEventsCalendar, 
        getMyPrivateEvents } = require('../controllers');
const { existsDataId } = require('../helpers');
const { validateJWT, isAdminUser, validateFields } = require('../middlewares');

api.post('/', [
    validateJWT,
    isAdminUser,
    check('title', 'The title is required').not().isEmpty(),
    check('region', 'The region is required').not().isEmpty(),
    check('region', 'The region ID is invalid').isMongoId(),
    check('region').custom(region => existsDataId(Region, region)),
    check('visibility', 'The visibility is required').not().isEmpty(),
    validateFields
], createEvent);

api.get('/', [
    validateJWT
], getEvents);

api.get('/events-region/:regionID', [
    validateJWT,
    check('regionID', 'The region ID is invalid').isMongoId(),
    check('regionID').custom(regionID => existsDataId(Region, regionID)),
    validateFields
], getEventsByRegion);

api.get('/my-events-calendar', [
    validateJWT
], getMyEventsCalendar);

api.get('/:id', [
    validateJWT,
    check('id', 'The event ID is not valid').isMongoId(),
    check('id').custom(id => existsDataId(Event, id)),
    validateFields
], getEvent);

api.get('/private/list/', [
    validateJWT,
], getMyPrivateEvents);

api.get('/public/list', [
    validateJWT,
], getMyPublicEvents);

api.put('/:id', [
    validateJWT,
    isAdminUser,
    check('id', 'The event ID is not valid').isMongoId(),
    check('id').custom(id => existsDataId(Event, id)),
    validateFields
], updateEvent);

api.delete('/:id', [
    validateJWT,
    isAdminUser,
    check('id', 'The event ID is not valid').isMongoId(),
    check('id').custom(id => existsDataId(Event, id)),
    validateFields
], deleteEvent);

module.exports = api;