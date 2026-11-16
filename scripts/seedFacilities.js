/**
 * Standalone seeder for Facilities collection.
 * Usage:  npm run seed:facilities
 *         npm run seed:facilities -- --force   (drops existing docs first)
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');

const DBURL = process.env.DBURL || process.env.MONGODB_URI;
if (!DBURL) {
  console.error('❌  DBURL not found in .env');
  process.exit(1);
}

const Facility = require('../models/facility');

const DEFAULT_FACILITIES = [
  {
    tag: 'Academic',
    icon: 'FiMonitor',
    title: 'Smart Class Rooms',
    desc: 'Well-designed, spacious, ventilated classrooms equipped with smart boards, LCD projectors, and audio-visual systems. High-speed internet access ensures engaging, tech-enriched learning.',
    img: 'fac-1.jpg',
    features: ['Smart Boards', 'LCD Projectors', 'AV Systems', 'Hi-Speed WiFi'],
    order: 1,
    status: 'active',
  },
  {
    tag: 'Events',
    icon: 'FiUsers',
    title: 'Multi Purpose Hall',
    desc: 'A versatile central facility designed to host academic seminars, cultural events, and co-curricular activities. Serves as the vibrant hub for interaction, learning, and celebrations.',
    img: 'fac-2.jpg',
    features: ['Seminars', 'Cultural Events', 'Auditorium', 'Stage Setup'],
    order: 2,
    status: 'active',
  },
  {
    tag: 'Knowledge',
    icon: 'FiBook',
    title: 'Digital Library',
    desc: 'A comprehensive knowledge hub with books, journals, and digital resources. Internet-enabled systems support research, innovation, and continuous learning for students and faculty.',
    img: 'fac-3.jpg',
    features: ['Digital Journals', 'E-Resources', 'Research Tools', 'Reading Zones'],
    order: 3,
    status: 'active',
  },
  {
    tag: 'Clinical',
    icon: 'FiActivity',
    title: 'Laboratory Facilities',
    desc: 'Modern, well-equipped laboratories provide hands-on experience and practical exposure. Students master theoretical concepts through real clinical simulations and skill-building exercises.',
    img: 'fac-4.jpg',
    features: ['Anatomy Lab', 'Nursing Skills Lab', 'Simulation Room', 'OBG Lab'],
    order: 4,
    status: 'active',
  },
  {
    tag: 'Wellness',
    icon: 'FiZap',
    title: 'Sports & Athletics',
    desc: 'Sports and physical education promote discipline, teamwork, leadership, and a healthy lifestyle. Students participate in inter-college tournaments and fitness programs year-round.',
    img: 'fac-5.jpg',
    features: ['Outdoor Courts', 'Indoor Games', 'Fitness Zone', 'Tournaments'],
    order: 5,
    status: 'active',
  },
  {
    tag: 'Culture',
    icon: 'FiMusic',
    title: 'Cultural Programs',
    desc: 'Rich cultural programs provide opportunities to explore creativity, showcase talents, and celebrate diversity. A vibrant campus life that enriches the overall student experience.',
    img: 'fac-6.png',
    features: ['Dance & Music', 'Art Programs', 'Festivals', 'Talent Shows'],
    order: 6,
    status: 'active',
  },
  {
    tag: 'Commute',
    icon: 'FiTruck',
    title: 'Transport Services',
    desc: 'Safe and reliable transport services ensure hassle-free commuting with well-planned routes, stops, and schedules for students and staff. GPS-enabled fleet for your security.',
    img: 'fac-7.jpg',
    features: ['GPS Enabled', 'Multiple Routes', 'Safe Commute'],
    order: 7,
    status: 'active',
  },
  {
    tag: 'Residence',
    icon: 'FiHome',
    title: 'Hostel Accommodation',
    desc: 'Comfortable and secure hostel facilities provide a safe, supportive home away from home. Separate hostels for boys and girls with wardens, recreational areas, and all amenities.',
    img: 'fac-8.jpg',
    features: ['Boys & Girls Hostels', 'Common Rooms', 'In-house Dining', 'Security'],
    order: 8,
    status: 'active',
  },
  {
    tag: 'Dining',
    icon: 'FiCoffee',
    title: 'Campus Canteen',
    desc: 'A vibrant canteen offering hygienic and affordable food where students and staff can relax and socialize. Nutritious meals and a warm atmosphere fuel productive minds.',
    img: 'fac-9.jpg',
    features: ['Hygienic Food', 'Affordable Pricing', 'Nutritious Menu', 'Social Space'],
    order: 9,
    status: 'active',
  },
];

async function seed() {
  const force = process.argv.includes('--force');
  try {
    await mongoose.connect(DBURL);
    console.log('✅ Connected to MongoDB');

    if (force) {
      const del = await Facility.deleteMany({});
      console.log(`🗑️  Dropped ${del.deletedCount} existing facility documents.`);
    }

    const count = await Facility.countDocuments();
    if (count > 0 && !force) {
      console.log(`ℹ️  Facilities collection already has ${count} items. Use --force to overwrite.`);
      process.exit(0);
    }

    const inserted = await Facility.insertMany(DEFAULT_FACILITIES);
    console.log(`🎉 Successfully seeded ${inserted.length} campus facilities!`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seed();

