/**
 * Standalone seeder for Courses collection.
 * Usage:  npm run seed:courses
 *         npm run seed:courses -- --force   (drops existing docs first)
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');

const DBURL = process.env.DBURL || process.env.MONGODB_URI;
if (!DBURL) {
  console.error('❌  DBURL not found in .env');
  process.exit(1);
}

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

async function seed() {
  const force = process.argv.includes('--force');
  try {
    await mongoose.connect(DBURL);
    console.log('✅ Connected to MongoDB');

    if (force) {
      const del = await Course.deleteMany({});
      console.log(`🗑️  Dropped ${del.deletedCount} existing course documents.`);
    }

    const count = await Course.countDocuments();
    if (count > 0 && !force) {
      console.log(`ℹ️  Courses collection already has ${count} items. Use --force to overwrite.`);
      process.exit(0);
    }

    const inserted = await Course.insertMany(DEFAULT_COURSES);
    console.log(`🎉 Successfully seeded ${inserted.length} courses!`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seed();

