const express = require("express");
const upload = require("../middleware/multer");
const {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  seedDefaultDepartments,
} = require("../controller/department");

const router = express.Router();

router.get("/seed", seedDefaultDepartments);
router.post("/seed", seedDefaultDepartments);

router.get("/", getAllDepartments);
router.get("/:id", getDepartmentById);
router.post("/", upload.single("image"), createDepartment);
router.put("/:id", upload.single("image"), updateDepartment);
router.delete("/:id", deleteDepartment);

module.exports = router;
