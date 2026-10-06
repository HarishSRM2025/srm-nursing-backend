const StudentAchievement = require("./studentAchievement");
const FacultyAchievement = require("./facultyAchievement");

function achievementModel(type = "student") {
  if (type === "student") return StudentAchievement;
  if (type === "faculty") return FacultyAchievement;
  throw Object.assign(new Error("Invalid achievement type"), { status: 400 });
}

module.exports = { StudentAchievement, FacultyAchievement, achievementModel };
