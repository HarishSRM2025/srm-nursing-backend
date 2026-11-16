const express = require('express');
const upload = require('../middleware/multer');
const {
  getFullGreenCampus,
  getAllInitiatives,
  getInitiativeById,
  createInitiative,
  updateInitiative,
  deleteInitiative,
  getAllGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  seedDefaultGreenCampus,
} = require('../controller/greenCampus');

const router = express.Router();

// Seed
router.get('/seed', seedDefaultGreenCampus);
router.post('/seed', seedDefaultGreenCampus);

// Full page endpoint
router.get('/', getFullGreenCampus);

// Initiatives endpoints
router.get('/initiatives', getAllInitiatives);
router.get('/initiatives/:id', getInitiativeById);
router.post('/initiatives', upload.single('image'), createInitiative);
router.put('/initiatives/:id', upload.single('image'), updateInitiative);
router.delete('/initiatives/:id', deleteInitiative);

// Gallery endpoints
router.get('/gallery', getAllGallery);
router.post('/gallery', upload.single('image'), createGalleryItem);
router.put('/gallery/:id', upload.single('image'), updateGalleryItem);
router.delete('/gallery/:id', deleteGalleryItem);

module.exports = router;

