const express = require("express");
const {
  getAllAchievements,
  getAchievementById,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  seedAchievements,
} = require("../controller/achievement");

const router = express.Router();

router.get("/", getAllAchievements);
router.get("/seed", seedAchievements);
router.get("/:id", getAchievementById);
router.post("/", createAchievement);
router.put("/:id", updateAchievement);
router.delete("/:id", deleteAchievement);

module.exports = router;
