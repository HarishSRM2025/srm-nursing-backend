const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const courseController = require('../controller/course');

// Seed default courses
router.get('/seed', courseController.seedCourses);
router.post('/seed', courseController.seedCourses);

// GET all courses
router.get('/', courseController.getCourses);

// GET single course
router.get('/:id', courseController.getCourse);

// CREATE course
router.post('/', upload.single('image'), courseController.createCourse);

// UPDATE course
router.put('/:id', upload.single('image'), courseController.updateCourse);

// DELETE course
router.delete('/:id', courseController.deleteCourse);

module.exports = router;

