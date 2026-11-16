const Course = require('../models/course');

const DEFAULT_COURSES = [
  {
    title: 'B.Sc. Nursing',
    fullName: 'Bachelor of Science in Nursing',
    badge: 'Undergraduate',
    duration: '4 Years Programme',
    image: 'course-1.jpg',
    desc: 'A four-year undergraduate degree that prepares nurses for comprehensive patient care with advanced clinical and theoretical training.',
    criteria: [
      'Age: 17 years on or before December 31',
      '10+2 with Science (PCB) & English, min 45%',
      'AISSCE / CBSE / ICSE / HSCE or equivalent',
      'Gender: Both Male and Female',
    ],
    order: 1,
    status: 'active',
  },
  {
    title: 'M.Sc. Nursing',
    fullName: 'Master of Science in Nursing',
    badge: 'Postgraduate',
    duration: '2 Years Programme',
    image: 'course-2.jpg',
    desc: 'An advanced postgraduate programme offering specialization in key nursing disciplines for experienced registered nurses.',
    criteria: [
      'Registered Nurse and Registered Midwife',
      'B.Sc Nursing / Post Basic B.Sc Nursing',
      'Minimum 55% aggregate score',
      'Minimum one year work experience',
    ],
    order: 2,
    status: 'active',
  },
  {
    title: 'DGNM',
    fullName: 'Diploma in General Nursing & Midwifery',
    badge: 'Diploma',
    duration: '3 Years Programme',
    image: 'course-3.jpg',
    desc: 'A comprehensive diploma programme designed to train skilled nursing professionals in general nursing and midwifery care.',
    criteria: [
      'Age: 17 years on or before December 31',
      '10+2 with English and minimum 40% marks',
      'From recognized board',
      'Gender: Only Females',
    ],
    order: 3,
    status: 'active',
  },
];

const parseCriteria = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return val.split('\n').map((s) => s.trim()).filter(Boolean);
    }
  }
  return [];
};

// GET all courses (supports status, badge, and search filter)
exports.getCourses = async (req, res) => {
  try {
    const { status, badge, search } = req.query;
    let filter = {};

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (badge && badge !== 'All') {
      filter.badge = new RegExp(`^${badge.trim()}$`, 'i');
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { title: regex },
        { fullName: regex },
        { desc: regex },
        { badge: regex },
      ];
    }

    let courses = await Course.find(filter).sort({ order: 1, createdAt: 1 });

    // Auto-seed if database is empty
    if (courses.length === 0 && !search && (!status || status === 'All') && (!badge || badge === 'All')) {
      const count = await Course.countDocuments();
      if (count === 0) {
        await Course.insertMany(DEFAULT_COURSES);
        courses = await Course.find().sort({ order: 1, createdAt: 1 });
      }
    }

    res.json({ success: true, count: courses.length, courses });
  } catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).json({ success: false, error: 'Server error', message: err.message });
  }
};

// Seed / Reseed default courses
exports.seedCourses = async (req, res) => {
  try {
    const { force } = req.query;
    if (force === 'true') {
      await Course.deleteMany({});
    }
    const count = await Course.countDocuments();
    if (count === 0) {
      await Course.insertMany(DEFAULT_COURSES);
    }
    const courses = await Course.find().sort({ order: 1, createdAt: 1 });
    res.json({
      success: true,
      message: force === 'true' ? 'Courses reset and reseeded' : 'Default courses seeded',
      count: courses.length,
      courses,
    });
  } catch (err) {
    console.error('Error seeding courses:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// GET single course by id
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, error: 'Course not found' });
    res.json({ success: true, course });
  } catch (err) {
    console.error('Error fetching course:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// CREATE new course
exports.createCourse = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.image = req.file.filename;
    } else if (!data.image) {
      data.image = '';
    }
    if (data.criteria !== undefined) {
      data.criteria = parseCriteria(data.criteria);
    }
    if (data.order !== undefined) {
      data.order = Number(data.order) || 0;
    }

    const course = new Course(data);
    await course.save();
    res.status(201).json({ success: true, course });
  } catch (err) {
    console.error('Error creating course:', err);
    res.status(400).json({ success: false, error: err.message });
  }
};

// UPDATE course
exports.updateCourse = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.image = req.file.filename;
    } else {
      if (!updateData.image) {
        delete updateData.image;
      }
    }
    if (updateData.criteria !== undefined) {
      updateData.criteria = parseCriteria(updateData.criteria);
    }
    if (updateData.order !== undefined) {
      updateData.order = Number(updateData.order) || 0;
    }

    const course = await Course.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!course) return res.status(404).json({ success: false, error: 'Course not found' });
    res.json({ success: true, course });
  } catch (err) {
    console.error('Error updating course:', err);
    res.status(400).json({ success: false, error: err.message });
  }
};

// DELETE course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ success: false, error: 'Course not found' });
    res.json({ success: true, message: 'Course deleted' });
  } catch (err) {
    console.error('Error deleting course:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

