const express = require("express");
const {
  getAllPublications,
  getPublicationById,
  createPublication,
  updatePublication,
  deletePublication,
  seedPublications
} = require("../controller/publication");

const router = express.Router();

router.get("/", getAllPublications);
router.get("/get-all", getAllPublications);
router.get("/get-publication-by-id/:id", getPublicationById);
router.get("/:id", getPublicationById);
router.post("/create", createPublication);
router.post("/", createPublication);
router.put("/update/:id", updatePublication);
router.put("/:id", updatePublication);
router.delete("/delete/:id", deletePublication);
router.delete("/:id", deletePublication);
router.post("/seed", seedPublications);

module.exports = router;
