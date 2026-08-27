const express = require("express");
const { addSlider, getSlider, updateSlider, deleteSlider } = require("../controller/Slider");
const upload = require("../middleware/multer");

const router = express.Router();

router.post("/add-slider", upload.single("Image"), addSlider);
router.get("/get-slider", getSlider);
router.put("/update-slider/:id", upload.single("Image"), updateSlider);
router.delete("/delete-slider/:id", deleteSlider);

module.exports = router;
