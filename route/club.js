const express = require('express');
const upload = require('../middleware/multer');
const {
  getAllClubs,
  getClubBySlug,
  createClub,
  updateClub,
  deleteClub,
  seedDefaultClubs,
} = require('../controller/club');

const router = express.Router();

router.get('/seed', seedDefaultClubs);
router.post('/seed', seedDefaultClubs);

router.get('/', getAllClubs);
router.get('/:slug', getClubBySlug);
router.post('/', upload.single('coverImage'), createClub);
router.put('/:id', upload.single('coverImage'), updateClub);
router.delete('/:id', deleteClub);

module.exports = router;

