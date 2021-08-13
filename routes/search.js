const { Router } = require('express');
const router = Router()

const { validateJWT } = require('../middlewares');
const { search } = require('../controllers/search');

router.get('/:collection/:term', [
    validateJWT
], search);


module.exports = router;