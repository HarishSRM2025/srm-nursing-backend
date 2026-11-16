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

const parseFeatures = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      return val.split(',').map((s) => s.trim()).filter(Boolean);
    }
  }
  return [];
};

// Get all facilities (optionally filter by status or search)
exports.getFacilities = async (req, res) => {
  try {
    const { status, search } = req.query;
    let filter = {};
    if (status && status !== 'All') {
      filter.status = status;
    }
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { title: regex },
        { tag: regex },
        { desc: regex },
      ];
    }

    let facilities = await Facility.find(filter).sort({ order: 1, createdAt: 1 });

    // Auto-seed if database is empty
    if (facilities.length === 0 && !search && (!status || status === 'All')) {
      const totalCount = await Facility.countDocuments();
      if (totalCount === 0) {
        await Facility.insertMany(DEFAULT_FACILITIES);
        facilities = await Facility.find().sort({ order: 1, createdAt: 1 });
      }
    }

    res.json({ success: true, count: facilities.length, facilities });
  } catch (err) {
    console.error('Error fetching facilities:', err);
    res.status(500).json({ success: false, error: 'Server error', message: err.message });
  }
};

// Seed default facilities
exports.seedFacilities = async (req, res) => {
  try {
    const { force } = req.query;
    if (force === 'true') {
      await Facility.deleteMany({});
    }
    const count = await Facility.countDocuments();
    if (count === 0) {
      await Facility.insertMany(DEFAULT_FACILITIES);
    }
    const facilities = await Facility.find().sort({ order: 1, createdAt: 1 });
    res.json({
      success: true,
      message: force === 'true' ? 'Facilities reset and reseeded' : 'Default facilities seeded',
      count: facilities.length,
      facilities,
    });
  } catch (err) {
    console.error('Error seeding facilities:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get single facility by id
exports.getFacility = async (req, res) => {
  try {
    const facility = await Facility.findById(req.params.id);
    if (!facility) return res.status(404).json({ success: false, error: 'Facility not found' });
    res.json({ success: true, facility });
  } catch (err) {
    console.error('Error fetching facility:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

// Create new facility
exports.createFacility = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.img = req.file.filename;
    } else if (!data.img) {
      data.img = '';
    }
    if (data.features) {
      data.features = parseFeatures(data.features);
    }
    if (data.order !== undefined) {
      data.order = Number(data.order) || 0;
    }

    const facility = new Facility(data);
    await facility.save();
    res.status(201).json({ success: true, facility });
  } catch (err) {
    console.error('Error creating facility:', err);
    res.status(400).json({ success: false, error: err.message });
  }
};

// Update existing facility
exports.updateFacility = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.img = req.file.filename;
    } else {
      delete updateData.image;
      if (!updateData.img) {
        delete updateData.img;
      }
    }
    if (updateData.features !== undefined) {
      updateData.features = parseFeatures(updateData.features);
    }
    if (updateData.order !== undefined) {
      updateData.order = Number(updateData.order) || 0;
    }

    const facility = await Facility.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!facility) return res.status(404).json({ success: false, error: 'Facility not found' });
    res.json({ success: true, facility });
  } catch (err) {
    console.error('Error updating facility:', err);
    res.status(400).json({ success: false, error: err.message });
  }
};

// Delete facility
exports.deleteFacility = async (req, res) => {
  try {
    const facility = await Facility.findByIdAndDelete(req.params.id);
    if (!facility) return res.status(404).json({ success: false, error: 'Facility not found' });
    res.json({ success: true, message: 'Facility deleted' });
  } catch (err) {
    console.error('Error deleting facility:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
