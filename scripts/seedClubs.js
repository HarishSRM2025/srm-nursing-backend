/**
 * Standalone seeder for Clubs collection.
 * Usage:  npm run seed:clubs
 *         npm run seed:clubs -- --force   (drops existing docs first)
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');

const DBURL = process.env.DBURL || process.env.MONGODB_URI;
if (!DBURL) {
  console.error('❌  DBURL not found in .env');
  process.exit(1);
}

const Club = require('../models/club');

const DEFAULT_CLUBS = [
  {
    slug: 'student-nurses-association',
    code: '01',
    name: 'Student Nurses Association (SNA)',
    shortName: 'SNA',
    tagline: 'Empowering future nurses through leadership, advocacy, and excellence in care.',
    category: 'welfare',
    icon: 'stethoscope',
    coverImage: 'club-sna.jpg',
    aim: 'The aim of SNA is to provide programs representative of fundamental and current professional interest concerns to nursing students, membership in SNA aids in the development of whole person including the professional role.',
    objectives: [
      'To uphold the dignity and honour of the nursing profession',
      'To promote participation in student community affairs',
      'To involve the students in intercollegiate sports and cultural activities',
      'To promote collaborative relationships with various health organizations',
      'To bring out the talents and confidence of the students for the upliftment of self and society',
      'To inculcate the value of espirit de corps',
      'To develop leadership abilities among the students',
      'To improve the students social contacts to enhance professional growth',
    ],
    order: 1,
    status: 'active',
  },
  {
    slug: 'anti-ragging-committee',
    code: '02',
    name: 'Anti-Ragging Committee',
    shortName: 'Anti-Ragging Committee',
    tagline: 'Empowering future nurses through leadership, advocacy, and excellence in care.',
    category: 'committee',
    icon: 'shield-alert',
    coverImage: 'club-anti-ragging.png',
    aim: 'To ensure a safe, respectful, and ragging-free campus by fostering a culture of dignity, mutual respect, inclusivity, and zero tolerance towards ragging in all its forms.',
    objectives: [
      'To prevent ragging in the institution through strict implementation of anti-ragging policies and regulations.',
      'To create awareness among students, parents, and staff about the harmful effects and legal consequences of ragging.',
      'To promote a welcoming, inclusive, and respectful environment for all students, especially freshers.',
      'To encourage healthy interactions, mentoring, and positive relationships between senior and junior students.',
      'To establish effective mechanisms for reporting, addressing, and resolving complaints related to ragging promptly and confidentially.',
      'To organize orientation programmes, awareness campaigns, seminars, and pledge activities on anti-ragging measures.',
    ],
    order: 2,
    status: 'active',
  },
  {
    slug: 'women-empowerment-club',
    code: '03',
    name: 'Women Empowerment Club',
    shortName: 'Women Empowerment Club',
    tagline: 'Empowering future nurses through leadership, advocacy, and excellence in care.',
    category: 'welfare',
    icon: 'heart-handshake',
    coverImage: 'club-women-empowerment.png',
    aim: 'To empower women students by fostering confidence, leadership, equality, safety, and personal development.',
    objectives: [
      'To promote awareness of the importance of overall wellness and healthy living.',
      'To encourage students to adopt healthy lifestyle practices, including balanced nutrition, regular physical activity, adequate sleep, and stress management.',
      'To promote mindfulness, resilience, emotional intelligence, and positive coping strategies for managing academic and personal challenges.',
      'To create a supportive and inclusive environment that encourages peer support, empathy, and mutual respect among students.',
    ],
    order: 3,
    status: 'active',
  },
  {
    slug: 'cultural-club',
    code: '04',
    name: 'Cultural Club',
    shortName: 'Cultural Club',
    tagline: 'Empowering future nurses through leadership, advocacy, and excellence in care.',
    category: 'cultural',
    icon: 'palette',
    coverImage: 'club-cultural.png',
    aim: "To promote students' artistic, cultural, and creative talents by providing opportunities for participation in cultural activities, fostering teamwork, leadership, and appreciation of diverse cultures.",
    objectives: [
      'To identify and nurture the artistic and creative talents of students.',
      'To encourage active participation in cultural, literary, and performing arts activities.',
      'To promote appreciation and respect for diverse cultures, traditions, and heritage.',
      "To develop students' confidence, communication, leadership, and organizational skills through cultural events.",
      'To organize cultural programs, competitions, festivals, and celebrations at the college.',
    ],
    order: 4,
    status: 'active',
  },
  {
    slug: 'journal-club',
    code: '05',
    name: 'Journal Club',
    shortName: 'Journal Club',
    tagline: 'A steady hand needs an expressive heart.',
    category: 'academic',
    icon: 'newspaper',
    coverImage: 'club-journal.png',
    aim: 'The Student Journal Club aims to foster a culture of evidence-based practice among nursing students by enhancing their ability to critically appraise, interpret, and apply current scientific research in clinical settings.',
    objectives: [
      'To promote evidence-based nursing practice by encouraging students to review and discuss current research articles relevant to healthcare and nursing.',
      'To develop critical thinking and analytical skills through systematic appraisal of scientific literature.',
      'To enhance research literacy by familiarizing students with research methodologies, statistical concepts, and scientific writing.',
      'To improve presentation and communication skills through structured journal presentations and group discussions.',
    ],
    order: 5,
    status: 'active',
  },
  {
    slug: 'linguistic-club',
    code: '06',
    name: 'Linguistic Club',
    shortName: 'Linguistic Club',
    tagline: "Care doesn't wait for a hospital bed.",
    category: 'academic',
    icon: 'languages',
    coverImage: 'club-linguistic.jpg',
    aim: 'The Linguistic Club is an enriching academic platform designed to enhance the language proficiency, communication competence, and cultural sensitivity of nursing students.',
    objectives: [
      "To develop students' skills in spoken and written communication.",
      'To encourage learning and appreciation of multiple languages.',
      'To strengthen patient–nurse communication, ensuring clarity, empathy, and understanding.',
      'To foster cultural competence for delivering holistic and inclusive patient care.',
      'To prepare students for global opportunities in nursing practice.',
    ],
    order: 6,
    status: 'active',
  },
  {
    slug: 'book-club',
    code: '07',
    name: 'Book Club',
    shortName: 'Book Club',
    tagline: 'Where curious minds turn clinical questions into evidence.',
    category: 'academic',
    icon: 'book-open',
    coverImage: 'club-book.jpg',
    aim: 'The initiative aims to cultivate a habit of reading and continuous learning among nursing students, enhance their knowledge beyond the academic curriculum, and develop critical thinking, analytical, and communication skills.',
    objectives: [
      'To encourage students to read diverse books related to nursing, health sciences, and general literature.',
      'To promote discussion, reflection, and sharing of ideas among students.',
      'To improve comprehension, vocabulary, and presentation skills.',
      'To foster empathy, ethical understanding, and holistic perspectives in patient care.',
      'To support academic excellence and evidence-based nursing practice.',
    ],
    order: 7,
    status: 'active',
  },
  {
    slug: 'student-wellness-club',
    code: '08',
    name: 'Student Wellness Club',
    shortName: 'Student Wellness Club',
    tagline: 'Empowering future nurses through leadership, advocacy, and excellence in care.',
    category: 'welfare',
    icon: 'heart-pulse',
    coverImage: 'club-student-wellness.png',
    aim: 'To promote the holistic well-being of students by fostering physical, mental, emotional, social, and spiritual wellness through education, awareness, and healthy lifestyle practices.',
    objectives: [
      'To create awareness among students about the importance of maintaining their own health and promoting the health of others.',
      'To develop a spirit of voluntary service and humanitarian values among youth.',
      'To train students in first aid, disaster preparedness, and emergency response.',
      'To motivate students to participate in blood donation, organ donation, and other life-saving initiatives.',
      'To promote leadership qualities, teamwork, discipline, and responsible citizenship.',
      'To organize health awareness programmes, environmental protection campaigns, and community outreach activities.',
    ],
    order: 8,
    status: 'active',
  },
  {
    slug: 'youth-red-cross-club',
    code: '09',
    name: 'Youth Red Cross (YRC) Club',
    shortName: 'YRC',
    tagline: 'Empowering future nurses through leadership, advocacy, and excellence in care.',
    category: 'social',
    icon: 'cross',
    coverImage: 'club-yrc.png',
    aim: 'To develop humanitarian values, social responsibility, leadership, and a spirit of voluntary service among students through activities that promote health, community welfare, disaster preparedness, and humanitarian service.',
    objectives: [
      'To create awareness among students, faculty, and staff about humanitarian values and voluntary service.',
      'To train students in first aid, disaster preparedness, and emergency response.',
      'To motivate students to participate in blood donation, organ donation, and other life-saving initiatives.',
      'To promote leadership qualities, teamwork, discipline, and responsible citizenship.',
      'To organize health awareness programmes, environmental protection campaigns, and community outreach activities.',
      'To organize orientation programmes, awareness campaigns, seminars, and pledge activities on anti-ragging measures.',
    ],
    order: 9,
    status: 'active',
  },
  {
    slug: 'sdg-cell',
    code: '10',
    name: 'Sustainable Development Goals (SDG) Cell',
    shortName: 'SDG Cell',
    tagline: 'Empowering future nurses through leadership, advocacy, and excellence in care.',
    category: 'social',
    icon: 'globe',
    coverImage: 'club-sdg.png',
    aim: 'To promote awareness, participation, and institutional commitment towards the United Nations Sustainable Development Goals (SDGs) by integrating sustainability into education, research, community engagement, and campus practices.',
    objectives: [
      'To create awareness among students, faculty, and staff about the 17 United Nations Sustainable Development Goals (SDGs) and their significance.',
      'To integrate sustainability principles into academic, research, extension, and outreach activities.',
      'To encourage environmentally responsible practices, including energy conservation, waste management, water conservation, and biodiversity protection.',
      'To promote social responsibility through community engagement, health promotion, education, and outreach programmes aligned with the SDGs.',
      'To organize seminars, workshops, awareness campaigns, and competitions on sustainable development and environmental stewardship.',
      'To encourage research, innovation, and student projects that contribute to achieving the SDGs.',
    ],
    order: 10,
    status: 'active',
  },
  {
    slug: 'iqac',
    code: '11',
    name: 'Internal Quality Assurance Cell (IQAC)',
    shortName: 'IQAC',
    tagline: 'Ensuring excellence in education and administration.',
    category: 'committee',
    icon: 'globe',
    coverImage: 'club-iqac.png',
    aim: 'To develop and sustain a culture of quality and excellence in the institution through continuous quality enhancement, academic innovation, institutional best practices, and effective governance, in accordance with NAAC guidelines.',
    objectives: [
      'To develop a system for conscious, consistent, and continuous improvement in the academic and administrative performance of the institution.',
      'To promote quality enhancement through innovative teaching–learning methodologies, research, extension activities, and student support services.',
      'To facilitate the implementation of quality benchmarks in academic and administrative processes.',
      'To encourage faculty development, professional excellence, and capacity-building initiatives.',
    ],
    order: 11,
    status: 'active',
  },
  {
    slug: 'internal-complaints-committee',
    code: '12',
    name: 'Internal Complaints Committee (ICC)',
    shortName: 'ICC',
    tagline: 'Empowering future nurses through leadership, advocacy, and excellence in care.',
    category: 'committee',
    icon: 'shield-alert',
    coverImage: 'club-icc.png',
    aim: 'The College has constituted an Internal Complaints Committee (ICC) in accordance with the University Grants Commission (Prevention, Prohibition and Redressal of Sexual Harassment of Women Employees and Students). The Committee is established to provide a safe, secure, inclusive, and dignified environment for all members of the College community.',
    objectives: [
      'To prevent sexual harassment within the College and its associated facilities.',
      'To create awareness regarding sexual harassment and gender equality.',
      'To provide a fair, confidential, and accessible mechanism for receiving and addressing complaints.',
      'To protect the dignity, safety, and rights of students and employees.',
      'To promote gender sensitization and a respectful campus environment.',
    ],
    order: 12,
    status: 'active',
  },
];

async function seed() {
  const force = process.argv.includes('--force');

  try {
    console.log('⏳  Connecting to MongoDB…');
    await mongoose.connect(DBURL);
    console.log('✅  Connected');

    if (force) {
      await Club.deleteMany({});
      console.log('🗑️   Existing clubs dropped');
    }

    const count = await Club.countDocuments();
    if (count > 0 && !force) {
      console.log(`ℹ️   ${count} clubs already exist. Use --force to reseed.`);
    } else {
      for (const data of DEFAULT_CLUBS) {
        await Club.findOneAndUpdate({ slug: data.slug }, data, { upsert: true, returnDocument: 'after' });
      }
      console.log(`✅  ${DEFAULT_CLUBS.length} clubs seeded`);
    }

    const all = await Club.find().sort({ order: 1 });
    console.log('\nClubs in DB:');
    all.forEach((c) => console.log(`  ${c.code}. ${c.name} [${c.slug}]`));
  } catch (err) {
    console.error('❌  Seed failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌  Disconnected');
  }
}

seed();

