const { Router } = require('express');
const { check } = require('express-validator');
const api = Router();

const Region = require('../models/region');
const { createRegion, getRegions, getRegion, updateRegion, deleteRegion } = require('../controllers');
const { existsDataId } = require('../helpers');
const { validateJWT, isAdminUser, validateFields } = require('../middlewares');

api.post('/', [
    validateJWT,
    isAdminUser,
    check('city', 'The city is required').not().isEmpty(),
    validateFields
], createRegion);

api.get('/', [], getRegions);

api.get('/:id', [
    check('id', 'The region ID is not valid').isMongoId(),
    check('id').custom(id => existsDataId(Region, id)),
    validateFields
], getRegion);

api.put('/:id', [
    validateJWT,
    isAdminUser,
    check('id', 'The region ID is not valid').isMongoId(),
    check('id').custom(id => existsDataId(Region, id)),
    validateFields
], updateRegion);

api.delete('/:id', [
    validateJWT,
    isAdminUser,
    check('id', 'The region ID is not valid').isMongoId(),
    check('id').custom(id => existsDataId(Region, id)),
    validateFields
], deleteRegion);

module.exports = api;