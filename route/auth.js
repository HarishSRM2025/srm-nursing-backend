const express = require("express");
const { signup, signin, getMe } = require("../controller/auth");

const router = express.Router();

router.post("/signup", signup);
router.post("/register", signup);
router.post("/signin", signin);
router.post("/login", signin);
router.get("/me", getMe);

module.exports = router;
