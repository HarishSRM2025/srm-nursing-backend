const express = require("express");
const {
  getAllDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment
} = require("../controller/department");

const router = express.Router();

router.get("/", getAllDepartments);
router.post("/", createDepartment);
router.put("/:id", updateDepartment);
router.delete("/:id", deleteDepartment);

module.exports = router;
