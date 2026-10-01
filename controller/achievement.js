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

const mongoose = require("mongoose");
const { typeFilter, listingQuery } = require("../services/achievementListing");
const scope = req => typeFilter(req.achievementType || "student");
const fail = (res, error) => res.status(error.name === "ValidationError" || error.name === "CastError" || error.status === 400 ? 400 : 500).json({ success: false, message: error.message });
const fields = ["student_or_batch", "award_or_title", "description", "year", "category", "status", "institution"];
const payload = req => Object.fromEntries(fields.filter(key => req.body?.[key] !== undefined).map(key => [key, req.body[key]]));
const idFilter = req => {
  if (!mongoose.isValidObjectId(req.params.id)) throw Object.assign(new Error("Invalid achievement ID"), { status: 400 });
  return { ...scope(req), _id: req.params.id };
};

exports.getAllAchievements = async (req, res) => {
  try {
    const { filter, base, page, limit, paginated } = listingQuery(req.query, req.achievementType || "student");
    const total = await Achievement.countDocuments(filter);
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const currentPage = Math.min(page, totalPages);
    let query = Achievement.find(filter).sort({ year: -1, sno: 1, _id: -1 });
    if (paginated) query = query.skip((currentPage - 1) * limit).limit(limit);
    const [achievements, years, categories, totalCount, activeCount, categoryCounts] = await Promise.all([
      query, Achievement.distinct("year", base), Achievement.distinct("category", base),
      Achievement.countDocuments(base), Achievement.countDocuments({ ...base, status: "active" }),
      Achievement.aggregate([{ $match: base }, { $group: { _id: "$category", count: { $sum: 1 } } }, { $sort: { _id: 1 } }])
    ]);
    res.json({ success: true, total, achievements,
      pagination: { page: currentPage, limit, total, totalPages },
      stats: { total: totalCount, active: activeCount, years: years.sort((a,b) => b-a), categories },
      filters: { total: totalCount, years: years.sort((a,b) => b-a), categories: categoryCounts.map(c => ({ name: c._id, count: c.count })) }
    });
  } catch (error) { fail(res, error); }
};
exports.getAchievementById = async (req, res) => {
  try {
    const achievement = await Achievement.findOne(idFilter(req));
    if (!achievement) return res.status(404).json({ success: false, message: "Achievement not found" });
    res.json({ success: true, achievement });
  } catch (error) { fail(res, error); }
};
exports.createAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.create({ ...payload(req), type: req.achievementType || "student" });
    res.status(201).json({ success: true, achievement });
  } catch (error) { fail(res, error); }
};
exports.updateAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findOneAndUpdate(idFilter(req), { $set: payload(req) }, { new: true, runValidators: true });
    if (!achievement) return res.status(404).json({ success: false, message: "Achievement not found" });
    res.json({ success: true, achievement });
  } catch (error) { fail(res, error); }
};
exports.deleteAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findOneAndDelete(idFilter(req));
    if (!achievement) return res.status(404).json({ success: false, message: "Achievement not found" });
    res.json({ success: true, message: "Achievement deleted successfully" });
  } catch (error) { fail(res, error); }
};
exports.seedAchievements = async (req, res) => {
  try {
    if (req.achievementType === "faculty") return res.status(400).json({ success: false, message: "No faculty seed records are available" });
    await Achievement.deleteMany(typeFilter("student"));
    await Achievement.insertMany(SEED_DATA);
    res.json({ success: true, message: `${SEED_DATA.length} student achievement records seeded.` });
  } catch (error) { fail(res, error); }
};
