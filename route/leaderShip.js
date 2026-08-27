const express = require("express");
const router = express.Router();
const {createLeaderShip,getLeaderShip,getLeaderShipById,updateLeaderShip,deleteLeaderShip} = require("../controller/leaderShip");
const upload = require("../middleware/multer");

router.post("/create",upload.single("ProfileImage"),createLeaderShip);
router.get("/get",getLeaderShip);
router.get("/get/:id",getLeaderShipById);
router.put("/update/:id",upload.single("ProfileImage"),updateLeaderShip);
router.delete("/delete/:id",deleteLeaderShip);

module.exports = router;
