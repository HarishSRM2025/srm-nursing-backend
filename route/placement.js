const router = require('express').Router();
const { getPlacements, updateSection } = require('../controller/placement');
const requireAdmin = require('../middleware/requireAdmin');

router.get('/', getPlacements);
router.put('/:section', requireAdmin, updateSection);

module.exports = router;
