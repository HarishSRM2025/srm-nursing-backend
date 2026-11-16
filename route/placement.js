const router = require('express').Router();
const { getPlacements } = require('../controller/placement');

router.get('/', getPlacements);

module.exports = router;
