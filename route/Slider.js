const express = require("express");
const { addSlider, getSlider, updateSlider, deleteSlider } = require("../controller/Slider");
const upload = require("../middleware/multer");

const router = express.Router();

const sliderImages = upload.fields([
    { name: "Image", maxCount: 1 },
    { name: "MobileImage", maxCount: 1 }
]);

router.post("/add-slider", sliderImages, addSlider);
router.get("/get-slider", getSlider);
router.put("/update-slider/:id", sliderImages, updateSlider);
router.delete("/delete-slider/:id", deleteSlider);

module.exports = router;
