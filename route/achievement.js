const express = require("express");
const {
  getAllAchievements,
  getAchievementById,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  bulkUploadAchievements,
  downloadTemplate,
} = require("../controller/achievement");

const router = express.Router();

router.get("/", getAllAchievements);
router.get("/template", downloadTemplate);
router.post("/bulk-upload", require("../middleware/eventSpreadsheet"), bulkUploadAchievements);
router.get("/:id", getAchievementById);
router.post("/", createAchievement);
router.put("/:id", updateAchievement);
router.delete("/:id", deleteAchievement);

module.exports = router;
