const router = require('express').Router();
const { getSections, saveSection } = require('../controller/codeOfConduct');
const requireAdmin = require('../middleware/requireAdmin');
router.get('/', getSections);
router.put('/:id', requireAdmin, saveSection);
module.exports = router;
