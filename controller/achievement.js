const StudentAchievement = require("../models/achivement/studentAchievement");
const FacultyAchievement = require("../models/achivement/facultyAchievement");

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
    const total = await (req.achievementType === "faculty" ? FacultyAchievement : StudentAchievement).countDocuments(filter);
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const currentPage = Math.min(page, totalPages);
    let query = (req.achievementType === "faculty" ? FacultyAchievement : StudentAchievement).find(filter).sort({ year: -1, sno: 1, _id: -1 });
    if (paginated) query = query.skip((currentPage - 1) * limit).limit(limit);
    const [achievements, years, categories, totalCount, activeCount, categoryCounts] = await Promise.all([
      query, (req.achievementType === "faculty" ? FacultyAchievement : StudentAchievement).distinct("year", base), (req.achievementType === "faculty" ? FacultyAchievement : StudentAchievement).distinct("category", base),
      (req.achievementType === "faculty" ? FacultyAchievement : StudentAchievement).countDocuments(base), (req.achievementType === "faculty" ? FacultyAchievement : StudentAchievement).countDocuments({ ...base, status: "active" }),
      (req.achievementType === "faculty" ? FacultyAchievement : StudentAchievement).aggregate([{ $match: base }, { $group: { _id: "$category", count: { $sum: 1 } } }, { $sort: { _id: 1 } }])
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
    const achievement = await (req.achievementType === "faculty" ? FacultyAchievement : StudentAchievement).findOne(idFilter(req));
    if (!achievement) return res.status(404).json({ success: false, message: "Achievement not found" });
    res.json({ success: true, achievement });
  } catch (error) { fail(res, error); }
};
exports.createAchievement = async (req, res) => {
  try {
    const achievement = await (req.achievementType === "faculty" ? FacultyAchievement : StudentAchievement).create({ ...payload(req), type: req.achievementType || "student" });
    res.status(201).json({ success: true, achievement });
  } catch (error) { fail(res, error); }
};
exports.updateAchievement = async (req, res) => {
  try {
    const achievement = await (req.achievementType === "faculty" ? FacultyAchievement : StudentAchievement).findOneAndUpdate(idFilter(req), { $set: payload(req) }, { new: true, runValidators: true });
    if (!achievement) return res.status(404).json({ success: false, message: "Achievement not found" });
    res.json({ success: true, achievement });
  } catch (error) { fail(res, error); }
};
exports.deleteAchievement = async (req, res) => {
  try {
    const achievement = await (req.achievementType === "faculty" ? FacultyAchievement : StudentAchievement).findOneAndDelete(idFilter(req));
    if (!achievement) return res.status(404).json({ success: false, message: "Achievement not found" });
    res.json({ success: true, message: "Achievement deleted successfully" });
  } catch (error) { fail(res, error); }
};
exports.bulkUploadAchievements = async (req, res) => {
  try {
    const report = await require("../services/achievementImport").importAchievements(req.file.buffer, req.achievementType || "student");
    res.status(report.failed ? (report.imported ? 207 : 422) : 201).json(report);
  } catch (error) { fail(res, error); }
};
exports.downloadTemplate = async (req, res) => {
  try {
    const buffer = await require("../services/achievementImport").createTemplate();
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", 'attachment; filename="achievements-template.xlsx"');
    res.send(Buffer.from(buffer));
  } catch (error) { fail(res, error); }
};
