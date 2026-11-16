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
    aim: 'To promote students\' artistic, cultural, and creative talents by providing opportunities for participation in cultural activities, fostering teamwork, leadership, and appreciation of diverse cultures.',
    objectives: [
      'To identify and nurture the artistic and creative talents of students.',
      'To encourage active participation in cultural, literary, and performing arts activities.',
      'To promote appreciation and respect for diverse cultures, traditions, and heritage.',
      'To develop students\' confidence, communication, leadership, and organizational skills through cultural events.',
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
    tagline: 'Care doesn\'t wait for a hospital bed.',
    category: 'academic',
    icon: 'languages',
    coverImage: 'club-linguistic.jpg',
    aim: 'The Linguistic Club is an enriching academic platform designed to enhance the language proficiency, communication competence, and cultural sensitivity of nursing students.',
    objectives: [
      'To develop students\' skills in spoken and written communication.',
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
    aim: 'The initiative aims to cultivate a habit of reading and continuous learning among nursing students, enhance their knowledge beyond the academic curriculum, and develop critical thinking, analytical, and communication skills that support both their academic success and professional growth.',
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
    aim: 'To promote awareness, participation, and institutional commitment towards the United Nations Sustainable Development Goals (SDGs) by integrating sustainability into education, research, community engagement, and campus practices for the holistic development of society.',
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
    aim: 'To develop and sustain a culture of quality and excellence in the institution through continuous quality enhancement, academic innovation, institutional best practices, and effective governance, in accordance with the guidelines of the National Assessment and Accreditation Council (NAAC).',
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
    aim: 'The College has constituted an Internal Complaints Committee (ICC) in accordance with the University Grants Commission (Prevention, Prohibition and Redressal of Sexual Harassment of Women Employees and Students). The Committee is established to provide a safe, secure, inclusive, and dignified environment for all members of the College community and to prevent, prohibit, and redress complaints relating to sexual harassment.',
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

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');

const parseJsonIfNeeded = (value, fallback = []) => {
  if (value === undefined || value === null) return fallback;
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch {
      const split = value.split('\n').map((s) => s.trim()).filter(Boolean);
      return split.length ? split : [value];
    }
  }
  return fallback;
};

const ensureClubsSeeded = async () => {
  const count = await Club.countDocuments();
  if (count === 0) {
    await Club.insertMany(DEFAULT_CLUBS);
  }
};

// GET /api/clubs
exports.getAllClubs = async (req, res) => {
  try {
    const { status, category, search } = req.query;
    let filter = {};

    if (status && status !== 'All') {
      filter.status = status;
    }
    if (category && category !== 'All') {
      filter.category = category;
    }
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { name: regex },
        { shortName: regex },
        { slug: regex },
        { tagline: regex },
        { aim: regex },
      ];
    }

    const clubs = await Club.find(filter).sort({ order: 1, createdAt: 1 });
    res.status(200).json({ success: true, count: clubs.length, clubs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch clubs', error: error.message });
  }
};

// GET /api/clubs/:slug
exports.getClubBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    let club = null;

    if (slug && slug.match(/^[0-9a-fA-F]{24}$/)) {
      club = await Club.findById(slug);
    }
    if (!club) {
      club = await Club.findOne({ slug: slug.toLowerCase() });
    }

    if (!club) {
      return res.status(404).json({ success: false, message: 'Club not found' });
    }

    res.status(200).json({ success: true, club });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch club', error: error.message });
  }
};

// POST /api/clubs
exports.createClub = async (req, res) => {
  try {
    const { name, slug, shortName, tagline, category, icon, aim, objectives, order, status, code } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Club name is required' });
    }

    const generatedSlug = (slug && slug.trim()) ? slugify(slug) : slugify(name);

    const existing = await Club.findOne({ slug: generatedSlug });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Slug '${generatedSlug}' already exists. Please choose a unique slug.`,
      });
    }

    const coverImage = req.file ? req.file.filename : (req.body.coverImage || '');

    const club = new Club({
      slug: generatedSlug,
      code: code ? code.trim() : '',
      name: name.trim(),
      shortName: shortName ? shortName.trim() : name.trim(),
      tagline: tagline ? tagline.trim() : '',
      category: category || 'other',
      icon: icon ? icon.trim() : 'stethoscope',
      coverImage,
      aim: aim ? aim.trim() : '',
      objectives: parseJsonIfNeeded(objectives, []),
      order: order !== undefined && order !== '' ? Number(order) : 0,
      status: status || 'active',
    });

    await club.save();
    res.status(201).json({ success: true, message: 'Club created successfully', club });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create club', error: error.message });
  }
};

// PUT /api/clubs/:id
exports.updateClub = async (req, res) => {
  try {
    const { id } = req.params;
    let club = null;

    if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
      club = await Club.findById(id);
    }
    if (!club) {
      club = await Club.findOne({ slug: id.toLowerCase() });
    }

    if (!club) {
      return res.status(404).json({ success: false, message: 'Club not found' });
    }

    const { name, slug, shortName, tagline, category, icon, aim, objectives, order, status, coverImage, code } =
      req.body;

    const updateDoc = {};

    if (name && name.trim()) updateDoc.name = name.trim();
    if (code !== undefined) updateDoc.code = code.trim ? code.trim() : code;
    if (shortName !== undefined) updateDoc.shortName = shortName.trim ? shortName.trim() : shortName;
    if (tagline !== undefined) updateDoc.tagline = tagline.trim ? tagline.trim() : tagline;
    if (category !== undefined) updateDoc.category = category;
    if (icon !== undefined) updateDoc.icon = icon.trim ? icon.trim() : icon;
    if (aim !== undefined) updateDoc.aim = aim.trim ? aim.trim() : aim;

    if (slug && slug.trim()) {
      const newSlug = slugify(slug);
      if (newSlug !== club.slug) {
        const conflict = await Club.findOne({ slug: newSlug, _id: { $ne: club._id } });
        if (conflict) {
          return res.status(400).json({ success: false, message: `Slug '${newSlug}' is already taken.` });
        }
        updateDoc.slug = newSlug;
      }
    }

    if (req.file) {
      updateDoc.coverImage = req.file.filename;
    } else if (coverImage !== undefined && coverImage !== '') {
      updateDoc.coverImage = coverImage;
    }

    if (objectives !== undefined) {
      updateDoc.objectives = parseJsonIfNeeded(objectives, club.objectives);
    }

    if (order !== undefined && order !== '') {
      updateDoc.order = Number(order);
    }

    if (status !== undefined) {
      updateDoc.status = status;
    }

    const updated = await Club.findByIdAndUpdate(club._id, { $set: updateDoc }, { returnDocument: 'after' });

    res.status(200).json({ success: true, message: 'Club updated successfully', club: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update club', error: error.message });
  }
};

// DELETE /api/clubs/:id
exports.deleteClub = async (req, res) => {
  try {
    const { id } = req.params;
    let club = null;

    if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
      club = await Club.findByIdAndDelete(id);
    }
    if (!club) {
      club = await Club.findOneAndDelete({ slug: id.toLowerCase() });
    }

    if (!club) {
      return res.status(404).json({ success: false, message: 'Club not found' });
    }

    res.status(200).json({ success: true, message: 'Club deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete club', error: error.message });
  }
};

// POST /api/clubs/seed
exports.seedDefaultClubs = async (req, res) => {
  try {
    const { force } = req.query;
    if (force === 'true') {
      await Club.deleteMany({});
    }
    const count = await Club.countDocuments();
    if (count === 0) {
      await Club.insertMany(DEFAULT_CLUBS);
    }
    const clubs = await Club.find().sort({ order: 1 });
    res.status(200).json({
      success: true,
      message: force === 'true' ? 'Clubs reset and seeded successfully' : 'Default clubs ensured',
      count: clubs.length,
      clubs,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to seed clubs', error: error.message });
  }
};

