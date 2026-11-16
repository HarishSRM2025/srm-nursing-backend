const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const facilityController = require('../controller/facility');

// SEED default facilities
router.get('/seed', facilityController.seedFacilities);
router.post('/seed', facilityController.seedFacilities);

// GET all facilities (optional status/search filter)
router.get('/', facilityController.getFacilities);

// GET single facility by id
router.get('/:id', facilityController.getFacility);

// CREATE facility
router.post('/', upload.single('image'), facilityController.createFacility);

// UPDATE facility
router.put('/:id', upload.single('image'), facilityController.updateFacility);

// DELETE facility
router.delete('/:id', facilityController.deleteFacility);

module.exports = router;
