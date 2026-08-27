const Achievement = require("../models/achievement");

const SEED_DATA = [
  {
    sno: 1,
    student_or_batch: "SRMTCON Students",
    award_or_title: "Student Award for Research on AI Short Film",
    description: "Awarded for research work on an AI short film.",
    year: 2025,
    category: "Research",
    status: "active",
    institution: "SRM TRICHY COLLEGE OF NURSING"
  },
  {
    sno: 2,
    student_or_batch: "2023–2027 Batch",
    award_or_title: "Student Award – Weight Lifting",
    description: "Awarded to a student of the 2022–2027 batch for weight lifting.",
    year: 2025,
    category: "Sports",
    status: "active",
    institution: "SRM TRICHY COLLEGE OF NURSING"
  },
  {
    sno: 3,
    student_or_batch: "SRMTCON Students",
    award_or_title: "Overall Award – Zonal Competition, TNNMC",
    description: "SRMTCON students won the overall award (Second Place) at the zonal competition.",
    year: 2025,
    category: "Cultural",
    status: "active",
    institution: "SRM TRICHY COLLEGE OF NURSING"
  },
  {
    sno: 4,
    student_or_batch: "SRMTCON Students",
    award_or_title: "Student Award – Marathon Race",
    description: "Awarded to students for participation/achievement in the marathon race.",
    year: 2025,
    category: "Sports",
    status: "active",
    institution: "SRM TRICHY COLLEGE OF NURSING"
  },
  {
    sno: 5,
    student_or_batch: "Ms. Bhavasri (2022–2026 Batch)",
    award_or_title: "First Place – Poster Presentation, World Suicide Prevention Day",
    description: "Won first place in the poster presentation held on World Suicide Prevention Day.",
    year: 2025,
    category: "Academic",
    status: "active",
    institution: "SRM TRICHY COLLEGE OF NURSING"
  },
  {
    sno: 6,
    student_or_batch: "Ms. Bhavasri (2023–2026 Batch)",
    award_or_title: "Second Prize – Painting Competition, Zonal Competition, TNNMC",
    description: "Won second prize in the painting competition at the zonal competition.",
    year: 2025,
    category: "Cultural",
    status: "active",
    institution: "SRM TRICHY COLLEGE OF NURSING"
  },
  {
    sno: 7,
    student_or_batch: "Ms. Yogaarthi (2021–2025 Batch)",
    award_or_title: "First Prize – Mono Act, Zonal Competition, TNNMC",
    description: "Won first prize in the mono act event at the zonal competition.",
    year: 2025,
    category: "Cultural",
    status: "active",
    institution: "SRM TRICHY COLLEGE OF NURSING"
  },
  {
    sno: 8,
    student_or_batch: "2024–2028 Batch (Boys)",
    award_or_title: "Second Prize – Reels Competition, World Suicide Prevention Day",
    description: "Won second prize in the reels competition held on World Suicide Prevention Day.",
    year: 2025,
    category: "Cultural",
    status: "active",
    institution: "SRM TRICHY COLLEGE OF NURSING"
  },
  {
    sno: 9,
    student_or_batch: "Ms. Praiselin Jeneta. M (2020-2024)",
    award_or_title: "Certificate of Merit – Highest Marks in Midwifery & Obstetrical Nursing",
    description: "Secured the highest marks in Midwifery & Obstetrical Nursing in the TN Dr. MGR Medical University Examination, Academic Year 2024.",
    year: 2026,
    category: "Academic",
    status: "active",
    institution: "SRM TRICHY COLLEGE OF NURSING"
  },
  {
    sno: 10,
    student_or_batch: "Ms. Praiselin Jeneta. M (2020-2024)",
    award_or_title: "Certificate of Merit – Best Outgoing Student",
    description: "Recognised as the Best Outgoing Student at SRM Trichy College of Nursing for outstanding performance in the B.Sc. Nursing programme, 2020–2024.",
    year: 2026,
    category: "Academic",
    status: "active",
    institution: "SRM TRICHY COLLEGE OF NURSING"
  },
  {
    sno: 11,
    student_or_batch: "Ms. Yaalnee (2021-2025)",
    award_or_title: "Certificate of Merit – Best Outgoing Student",
    description: "Recognised as the Best Outgoing Student at SRM Trichy College of Nursing for outstanding performance in the B.Sc. Nursing programme, 2021–2025.",
    year: 2026,
    category: "Academic",
    status: "active",
    institution: "SRM TRICHY COLLEGE OF NURSING"
  },
  {
    sno: 12,
    student_or_batch: "Ms. Yaalnee (2021-2025)",
    award_or_title: "Certificate of Merit – Highest Marks in Midwifery & Obstetrical Nursing and Community Health Nursing II",
    description: "Secured the highest marks in Midwifery & Obstetrical Nursing and Community Health Nursing II in the TN Dr. MGR Medical University Examination, Academic Year 2025.",
    year: 2026,
    category: "Academic",
    status: "active",
    institution: "SRM TRICHY COLLEGE OF NURSING"
  }
];

const seedAchievements = async () => {
  try {
    const count = await Achievement.countDocuments();
    if (count === 0) {
      await Achievement.insertMany(SEED_DATA);
      console.log("Achievement records seeded successfully.");
    }
  } catch (err) {
    console.error("Achievement seeding error:", err.message);
  }
};

exports.getAllAchievements = async (req, res) => {
  try {
    await seedAchievements();
    const { status, year, category, search } = req.query;
    let filter = {};

    if (status && status !== "All") filter.status = status;
    if (year && year !== "All") filter.year = Number(year);
    if (category && category !== "All") filter.category = category;
    if (search) {
      filter.$or = [
        { student_or_batch: new RegExp(search, "i") },
        { award_or_title: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
      ];
    }

    const achievements = await Achievement.find(filter).sort({ year: -1, sno: 1 });

    const totalCount = await Achievement.countDocuments();
    const activeCount = await Achievement.countDocuments({ status: "active" });
    const years = await Achievement.distinct("year");
    const categories = await Achievement.distinct("category");

    res.status(200).json({
      success: true,
      total: achievements.length,
      stats: { total: totalCount, active: activeCount, years: years.sort((a, b) => b - a), categories },
      achievements,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch achievements", error: error.message });
  }
};

exports.getAchievementById = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    if (!achievement) return res.status(404).json({ success: false, message: "Achievement not found" });
    res.status(200).json({ success: true, achievement });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch achievement", error: error.message });
  }
};

exports.createAchievement = async (req, res) => {
  try {
    const { student_or_batch, award_or_title, description, year, category, status, institution } = req.body;
    if (!student_or_batch || !award_or_title || !year) {
      return res.status(400).json({ success: false, message: "student_or_batch, award_or_title and year are required" });
    }

    const count = await Achievement.countDocuments();
    const achievement = new Achievement({
      student_or_batch: student_or_batch.trim(),
      award_or_title: award_or_title.trim(),
      description: description ? description.trim() : "",
      year: Number(year),
      category: category || "General",
      status: status || "active",
      institution: institution || "SRM TRICHY COLLEGE OF NURSING",
      sno: count + 1,
    });

    await achievement.save();
    res.status(201).json({ success: true, message: "Achievement created successfully", achievement });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create achievement", error: error.message });
  }
};

exports.updateAchievement = async (req, res) => {
  try {
    const { student_or_batch, award_or_title, description, year, category, status, institution } = req.body;
    const achievement = await Achievement.findByIdAndUpdate(
      req.params.id,
      { student_or_batch, award_or_title, description, year: year ? Number(year) : undefined, category, status, institution },
      { new: true, runValidators: true }
    );
    if (!achievement) return res.status(404).json({ success: false, message: "Achievement not found" });
    res.status(200).json({ success: true, message: "Achievement updated successfully", achievement });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update achievement", error: error.message });
  }
};

exports.deleteAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findByIdAndDelete(req.params.id);
    if (!achievement) return res.status(404).json({ success: false, message: "Achievement not found" });
    res.status(200).json({ success: true, message: "Achievement deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete achievement", error: error.message });
  }
};

exports.seedAchievements = async (req, res) => {
  try {
    await Achievement.deleteMany({});
    await Achievement.insertMany(SEED_DATA);
    res.status(200).json({ success: true, message: `${SEED_DATA.length} achievement records seeded.` });
  } catch (error) {
    res.status(500).json({ success: false, message: "Seeding failed", error: error.message });
  }
};
